import { Request, Response } from "express";
import NotificationRepository from "../../../../application/repositories/user/notificationRepository";
import GetUnreadNotificationCount from "../../../../application/useCases/user/user/getUnreadNotificationCount";

export default class GetUnreadNotificationCountController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const getUnreadNotificationCount = new GetUnreadNotificationCount(new NotificationRepository());

    try {
      const count = await getUnreadNotificationCount.execute(userId);

      res.status(200).json({ status: true, count });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
