import { INotification } from "../../../../infrastructure/database/models/notificationModal";
import NotificationRepository from "../../../repositories/user/notificationRepository";

export default class GetNotificationData {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public async execute(userId: string): Promise<INotification[]> {

    await this.notificationRepository.makeNotificationAsRead(userId);
    const notificationData = await this.notificationRepository.findAllById(userId);

    return notificationData;

  }
}
