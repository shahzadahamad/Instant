import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import TokenManager from "../../../../application/providers/tokenManager";
import ResetPassword from "../../../../application/useCases/user/authentication/resetPassword";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class ResetPasswordController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { password } = req.body;
    const { _id, token } = req.params;

    const resetPassword = new ResetPassword(new UserRepository(), new TokenManager(), new PasswordHasher(),);

    try {
      const status = await resetPassword.execute(_id, token, password);
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
