import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import VerifyAndSendMail from "../../../../application/useCases/user/authentication/verifyAndSendMail";
import TokenManager from "../../../../application/providers/tokenManager";
import { EmailService } from "../../../../application/providers/nodeMailer";

export default class ForgotPasswordController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { emailOrUsername } = req.body;

    const verifyAndSendMail = new VerifyAndSendMail(
      new UserRepository(),
      new TokenManager(),
      new EmailService()
    );

    try {
      const status = await verifyAndSendMail.execute(emailOrUsername);
      res.status(200).json({ message: status });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
