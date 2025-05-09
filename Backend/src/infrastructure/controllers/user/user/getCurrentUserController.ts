import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetCurrentUserController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    try {
      res.status(HttpStatusCode.OK).json(userId);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
