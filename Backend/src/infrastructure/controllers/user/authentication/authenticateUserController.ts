import { Request, Response } from "express";
import AuthenticateUser from "../../../../application/useCases/user/authentication/authenticateUser";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import TokenManager from "../../../../application/providers/tokenManager";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class LoginUserController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { usernameOrEmail, password } = req.body;

    const authenticateUser = new AuthenticateUser(new UserRepository(), new PasswordHasher(), new TokenManager());

    try {
      const { token, refreshToken, user } = await authenticateUser.execute(usernameOrEmail, password);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({ token, user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
