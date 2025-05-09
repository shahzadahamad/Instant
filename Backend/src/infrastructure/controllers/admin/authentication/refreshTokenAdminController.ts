import { Request, Response } from "express";
import TokenManager from "../../../../application/providers/tokenManager";
import AdminRepository from "../../../../application/repositories/admin/adminRepository";
import HandleAdminRefreshToken from "../../../../application/useCases/admin/authentication/handleAdminRefreshToken";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class RefreshTokenAdminController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const handleRefreshToken = new HandleAdminRefreshToken(new AdminRepository(), new TokenManager());
    const adminRefreshToken = req.cookies?.adminRefreshToken;
    try {
      const status = await handleRefreshToken.execute(adminRefreshToken);
      if (status.clearCookie) {
        res
          .clearCookie("adminRefreshToken")
          .status(HttpStatusCode.FORBIDDEN)
          .json({ error: MESSAGES.ERROR.INVALID_REFRESH_TOKEN });
        return;
      }
      res.status(HttpStatusCode.OK).json({ adminToken: status.adminToken });
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
