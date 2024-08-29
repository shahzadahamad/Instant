import { Request, Response } from "express";
import OtpSend from "../../../application/useCases/user/otpSend";
import OtpRepository from "../../../application/repositories/otpRepository";
import PasswordHasher from "../../../application/providers/passwordHasher";
import UserRepository from "../../../application/repositories/userRepository";
import { GenerateOTP } from "../../../application/providers/otpGenerate";
import { EmailService } from "../../../application/providers/nodeMailer";

export default class UserOtpVerification {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { email, fullname, username } = req.body;

    const otpSend = new OtpSend(
      new OtpRepository(),
      new UserRepository(),
      new PasswordHasher(),
      new GenerateOTP(),
      new EmailService(),
    );

    try {
      const otp = await otpSend.execute(email, fullname, username);

      return res.status(200).json({
        message: "OTP send successfully",
        id: otp._id,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
