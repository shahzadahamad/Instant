import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class LogoutController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res.status(HttpStatusCode.OK).json({ message: MESSAGES.SUCCESS.LOGOUT });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
