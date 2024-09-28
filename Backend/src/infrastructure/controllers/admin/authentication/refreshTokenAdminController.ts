import { Request, Response } from "express";
import TokenManager from "../../../../application/providers/tokenManager";
import AdminRepository from "../../../../application/repositories/admin/adminRepository";
import HandleAdminRefreshToken from "../../../../application/useCases/admin/authentication/handleAdminRefreshToken";

export default class RefreshTokenAdminController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const handleRefreshToken = new HandleAdminRefreshToken(
      new AdminRepository(),
      new TokenManager()
    );
    const adminRefreshToken = req.cookies?.adminRefreshToken;
    try {
      console.log(adminRefreshToken + 'admin refresh token')
      const status = await handleRefreshToken.execute(adminRefreshToken);
      if (status.clearCookie) {
        console.log('clear cokie')
        return res
          .clearCookie("adminRefreshToken")
          .status(403)
          .json({ error: "Invalid refresh token" });
      }
      return res.status(200).json({ adminToken: status.adminToken });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
