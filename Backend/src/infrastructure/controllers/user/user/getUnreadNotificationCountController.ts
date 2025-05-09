import { Request, Response } from "express";
import NotificationRepository from "../../../../application/repositories/user/notificationRepository";
import GetUnreadNotificationCount from "../../../../application/useCases/user/user/getUnreadNotificationCount";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetUnreadNotificationCountController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const getUnreadNotificationCount = new GetUnreadNotificationCount(new NotificationRepository());

    try {
      const count = await getUnreadNotificationCount.execute(userId);
      res.status(HttpStatusCode.OK).json({ status: true, count });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
