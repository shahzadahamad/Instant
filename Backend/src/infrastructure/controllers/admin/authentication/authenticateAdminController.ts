import { Request, Response } from "express";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import TokenManager from "../../../../application/providers/tokenManager";
import AuthenticateAdmin from "../../../../application/useCases/admin/authentication/authenticateAdmin";
import AdminRepository from "../../../../application/repositories/admin/adminRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";

export default class AuthenticateAdminController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { usernameOrEmail, password } = req.body;

    const authenticateAdmin = new AuthenticateAdmin(
      new AdminRepository(),
      new PasswordHasher(),
      new TokenManager()
    );

    try {
      const { token, refreshToken, admin } = await authenticateAdmin.execute(
        usernameOrEmail,
        password
      );
      res.cookie("adminRefreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.OK).json({ token, admin });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
