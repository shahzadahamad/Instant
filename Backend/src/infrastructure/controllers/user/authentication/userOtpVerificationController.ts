import { Request, Response } from "express";
import OtpSend from "../../../../application/useCases/user/authentication/otpSend";
import OtpRepository from "../../../../application/repositories/user/otpRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import { GenerateOTP } from "../../../../application/providers/otpGenerate";
import { EmailService } from "../../../../application/providers/nodeMailer";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import { IControllerHandler } from "../../interfaces/IControllerHandler";


export default class UserOtpVerificationController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { email, fullname, username } = req.body;

    const otpSend = new OtpSend(new OtpRepository(), new UserRepository(), new PasswordHasher(), new GenerateOTP(), new EmailService());

    try {
      const otp = await otpSend.execute(email, fullname, username);
      res.status(HttpStatusCode.OK).json({
        message: MESSAGES.SUCCESS.OTPSEND,
        id: otp._id,
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
      return;
    }
  }
}
