import { Request, Response } from "express";
import NotificationRepository from "../../../../application/repositories/user/notificationRepository";
import GetNotificationData from "../../../../application/useCases/user/user/getNotificationData";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import RequestRepository from "../../../../application/repositories/user/requrestRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";

export default class GetNotificationDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const getNotificationData = new GetNotificationData(new NotificationRepository(), new RequestRepository(), new UserRepository());

    try {
      const notificationData = await getNotificationData.execute(userId);

      res.status(HttpStatusCode.OK).json(notificationData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
