import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import TokenManager from "../../../../application/providers/tokenManager";
import HandleRefreshToken from "../../../../application/useCases/user/authentication/handleRefreshToken";

export default class RefreshTokenController {
  public async handle(req: Request, res: Response): Promise<void> {
    const handleRefreshToken = new HandleRefreshToken(
      new UserRepository(),
      new TokenManager()
    );

    const refreshToken = req.cookies?.refreshToken;
    try {
      const status = await handleRefreshToken.execute(refreshToken);

      if (status.clearCookie) {
        res
          .clearCookie("refreshToken")
          .status(403)
          .json({ error: "Invalid refresh token" });
        return;
      }
      res.status(200).json({ token: status.token });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
