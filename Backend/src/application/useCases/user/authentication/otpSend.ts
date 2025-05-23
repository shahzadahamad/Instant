import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IOtp } from "../../../../infrastructure/database/models/otpVerificationModel";
import { EmailOptionsOtp } from "../../../interface/emailInterface";
import { EmailService } from "../../../providers/nodeMailer";
import { GenerateOTP } from "../../../providers/otpGenerate";
import PasswordHasher from "../../../providers/passwordHasher";
import OtpRepository from "../../../repositories/user/implements/otpRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class OtpSend {
  private otpRepository: OtpRepository;
  private userRepository: UserRepository;
  private passwordHasher: PasswordHasher;
  private generateOTP: GenerateOTP;
  private emailService: EmailService;

  constructor(otpRepository: OtpRepository, userRepository: UserRepository, passwordHasher: PasswordHasher, generateOTP: GenerateOTP, emailService: EmailService) {
    this.otpRepository = otpRepository;
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.generateOTP = generateOTP;
    this.emailService = emailService;
  }

  public async execute(email: string, fullname: string, username: string): Promise<IOtp> {
    const otp = await this.generateOTP.generate();

    const hashedOtp = await this.passwordHasher.hash(otp);

    const isEmailExist = await this.userRepository.findByEmail(email);
    const isUsernameExist = await this.userRepository.findByUsername(username);

    if (isEmailExist) {
      throw new Error(MESSAGES.ERROR.USER_EXIST)
    }

    if (isUsernameExist) {
      throw new Error(MESSAGES.ERROR.USERNAME_EXIST);
    }

    const newOtp = await this.otpRepository.createOtp(hashedOtp);

    const emailOptions: EmailOptionsOtp = { to: email, otp: otp, fullname: fullname };
    await this.emailService.sendEmailOtp(emailOptions);
    return newOtp;
  }
}
