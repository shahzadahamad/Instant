import { IUser } from "../../../infrastructure/database/models/userModel";
import PasswordHasher from "../../providers/passwordHasher";
import OtpRepository from "../../repositories/otpRepository";
import UserRepository from "../../repositories/userRepository";

export default class CreateUser {
  private userRepository: UserRepository;
  private otpRepository: OtpRepository;
  private passwordHasher: PasswordHasher;

  constructor(
    userRepository: UserRepository,
    otpRepository: OtpRepository,
    passwordHasher: PasswordHasher
  ) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
    this.passwordHasher = passwordHasher;
  }

  public async execute(
    fullname: string,
    username: string,
    email: string,
    password: string,
    id: string,
    otp: number
  ): Promise<IUser | null> {
    const isOtpExist = await this.otpRepository.findByOptId(id);
    if (isOtpExist) {
      const verifyOtp = await this.passwordHasher.compare(
        String(otp),
        isOtpExist.otp
      );
      if (!verifyOtp) {
        throw new Error("Invalid otp");
      }
    } else {
      throw new Error("Invalid otp");
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const newUser = await this.userRepository.createUser({
      fullname,
      username,
      email,
      password: hashedPassword,
    } as IUser);

    await this.otpRepository.removeOtp(id);

    return newUser;
  }
}
