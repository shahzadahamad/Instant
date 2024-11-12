import NotificationModel, { INotification } from "../../../infrastructure/database/models/notificationModal";


export default class NotificationRepository {
  public async followUser(followingUserId: string, followerUserId: string,): Promise<INotification> {
    try {
      const newNotification = await new NotificationModel({
        userId: followerUserId,
        fromId: followingUserId,
        message: `started following you.`,
        read: false
      });
      return await newNotification.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }
}
