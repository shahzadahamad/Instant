import { Request, Response } from "express";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import TokenManager from "../../../../application/providers/tokenManager";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GoogleAuthenticateUser from "../../../../application/useCases/user/authentication/googleAuthenticateUser";
import GeneratePassword from "../../../../application/providers/generatePassword";
import GenerateUsername from "../../../../application/providers/generateUsername";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class LoginWithGoogleAuth implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { fullname, email } = req.body;

    const googleAuthenticateUser = new GoogleAuthenticateUser(new UserRepository(), new PasswordHasher(), new TokenManager(), new GeneratePassword(), new GenerateUsername());

    try {
      const { token, refreshToken, user } = await googleAuthenticateUser.execute(fullname, email);
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
