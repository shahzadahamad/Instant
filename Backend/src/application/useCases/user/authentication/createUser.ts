import { IUser } from "../../../../infrastructure/database/models/userModel";
import PasswordHasher from "../../../providers/passwordHasher";
import OtpRepository from "../../../repositories/user/otpRepository";
import UserRepository from "../../../repositories/user/userRepository";


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
    id: string[],
    otp: number
  ): Promise<IUser | null> {
    const isOtpExist = await this.otpRepository.findByOptId(id);
    if (isOtpExist) {
      const compareOtp = isOtpExist.map(async (element) => {
        return this.passwordHasher.compare(String(otp), element.otp);
      });
      const results = await Promise.allSettled(compareOtp);

      const isOtpValid = results.some(
        (result) => result.status === "fulfilled" && result.value === true
      );

      if (!isOtpValid) {
        throw new Error("Invalid OTP");
      }
    } else {
      throw new Error("Invalid OTP");
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
