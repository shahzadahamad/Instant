import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import TokenManager from "../../../../application/providers/tokenManager";
import ResetPassword from "../../../../application/useCases/user/authentication/resetPassword";
import PasswordHasher from "../../../../application/providers/passwordHasher";

export default class ResetPasswordController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { password } = req.body;
    const { _id, token } = req.params;

    const resetPassword = new ResetPassword(
      new UserRepository(),
      new TokenManager(),
      new PasswordHasher(),
    );

    try {
      const status = await resetPassword.execute(_id, token, password);
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
