import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import TokenManager from "../../../../application/providers/tokenManager";
import HandleRefreshToken from "../../../../application/useCases/user/authentication/handleRefreshToken";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class RefreshTokenController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const handleRefreshToken = new HandleRefreshToken(new UserRepository(), new TokenManager());

    const refreshToken = req.cookies?.refreshToken;
    try {
      const status = await handleRefreshToken.execute(refreshToken);

      if (status.clearCookie) {
        res
          .clearCookie("refreshToken")
          .status(HttpStatusCode.FORBIDDEN)
          .json({ error: MESSAGES.ERROR.INVALID_REFRESH_TOKEN });
        return;
      }
      res.status(HttpStatusCode.OK).json({ token: status.token });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
