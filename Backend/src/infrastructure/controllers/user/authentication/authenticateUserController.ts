import { Request, Response } from "express";
import AuthenticateUser from "../../../../application/useCases/user/authentication/authenticateUser";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import TokenManager from "../../../../application/providers/tokenManager";
import UserRepository from "../../../../application/repositories/user/userRepository";

export default class LoginUserController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { usernameOrEmail, password } = req.body;

    const authenticateUser = new AuthenticateUser(
      new UserRepository(),
      new PasswordHasher(),
      new TokenManager()
    );

    try {
      const { token, refreshToken, user } = await authenticateUser.execute(
        usernameOrEmail,
        password
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ token, user });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
