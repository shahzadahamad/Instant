import { IOtp } from "../../../infrastructure/database/models/otpVerificationModel";
import { EmailOptions } from "../../../types/authentication/authenticationTypes";
import { sendEmail } from "../../providers/nodeMailer";
import { generateOtp } from "../../providers/otpGenerate";
import PasswordHasher from "../../providers/passwordHasher";
import OtpRepository from "../../repositories/otpRepository";
import UserRepository from "../../repositories/userRepository";

export default class OtpSend {
  private otpRepository: OtpRepository;
  private userRepository: UserRepository;
  private passwordHasher: PasswordHasher;

  constructor(
    otpRepository: OtpRepository,
    userRepository: UserRepository,
    passwordHasher: PasswordHasher
  ) {
    this.otpRepository = otpRepository;
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  public async execute(email: string, fullname: string, username: string): Promise<IOtp> {
    const otp = await generateOtp();

    const hashedOtp = await this.passwordHasher.hash(otp);

    const emailOptions: EmailOptions = {
      to: email,
      otp: otp,
      fullname: fullname,
    };

    const isEmailExist = await this.userRepository.findByEmail(email);
    const isUsernameExist = await this.userRepository.findByUsername(username);

    if (isEmailExist) {
      throw new Error("User already exists");
    }

    if(isUsernameExist) {
      throw new Error("Username already exists");
    }

    const newOtp = await this.otpRepository.createOtp(hashedOtp);
    await sendEmail(emailOptions);

    return newOtp;
  }
}
