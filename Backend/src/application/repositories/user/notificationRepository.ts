import NotificationModel, { INotification } from "../../../infrastructure/database/models/notificationModal";


export default class NotificationRepository {
  public async send(from: string, to: string, message: string): Promise<INotification> {
    try {
      const newNotification = await new NotificationModel({
        userId: to,
        fromId: from,
        message,
        read: false
      });
      return await newNotification.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("error follow user!");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async unReadNotificationCount(userId: string): Promise<number> {
    try {
      return await NotificationModel.countDocuments({ userId, read: false });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("count docuement");
      }
      console.error("Unknown error count docuement");
      throw new Error("Unknown error");
    }
  }
}
