import NotificationModel, { INotification } from "../../../infrastructure/database/models/notificationModal";


export default class NotificationRepository {
  public async send(from: string, to: string, message: string, type: string, relation: string): Promise<INotification> {
    try {
      const newNotification = await new NotificationModel({
        userId: to,
        fromId: from,
        type,
        relation,
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

  public async findAllById(userId: string): Promise<INotification[]> {
    try {
      return await NotificationModel.find({ userId }).sort({ createdAt: -1 }).populate({ path: 'fromId', select: 'username fullname profilePicture isPrivateAccount' });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("count docuement");
      }
      console.error("Unknown error count docuement");
      throw new Error("Unknown error");
    }
  }

  public async makeNotificationAsRead(userId: string): Promise<void> {
    try {
      await NotificationModel.updateMany({ userId }, { $set: { read: true } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("count docuement");
      }
      console.error("Unknown error count docuement");
      throw new Error("Unknown error");
    }
  }

  public async editAllNotificationOfRelationFollow(userId: string, fromId: string, type: string, relation: string): Promise<void> {
    try {
      await NotificationModel.updateMany({ userId, fromId, relation }, { $set: { type } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("count docuement");
      }
      console.error("Unknown error count docuement");
      throw new Error("Unknown error");
    }
  }

  public async editMessageById(_id: string, message: string): Promise<void> {
    try {
      await NotificationModel.updateMany({ _id }, { $set: { message } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("count docuement");
      }
      console.error("Unknown error count docuement");
      throw new Error("Unknown error");
    }
  }

  public async removeNotificationById(_id: string): Promise<void> {
    try {
      await NotificationModel.deleteOne({ _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("count docuement");
      }
      console.error("Unknown error count docuement");
      throw new Error("Unknown error");
    }
  }

  public async removeAllNotificationOfSingleUser(userId: string, fromId: string, relation: string): Promise<void> {
    try {
      await NotificationModel.deleteMany({ userId, fromId, relation });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("count docuement");
      }
      console.error("Unknown error count docuement");
      throw new Error("Unknown error");
    }
  }

  public async removeNotificationOfUserByMessage(userId: string, fromId: string, message: string): Promise<void> {
    try {
      await NotificationModel.deleteMany({ userId, fromId, message });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("count docuement");
      }
      console.error("Unknown error count docuement");
      throw new Error("Unknown error");
    }
  }

}
