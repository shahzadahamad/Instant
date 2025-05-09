import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import VerifyAndSendMail from "../../../../application/useCases/user/authentication/verifyAndSendMail";
import TokenManager from "../../../../application/providers/tokenManager";
import { EmailService } from "../../../../application/providers/nodeMailer";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class ForgotPasswordController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { emailOrUsername } = req.body;

    const verifyAndSendMail = new VerifyAndSendMail(new UserRepository(), new TokenManager(), new EmailService());

    try {
      const status = await verifyAndSendMail.execute(emailOrUsername);
      res.status(HttpStatusCode.OK).json({ message: status });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
