import { INotification } from "../../../../infrastructure/database/models/notificationModal";
import { IRequest } from "../../../../infrastructure/database/models/requestModal";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import RequestRepository from "../../../repositories/user/requrestRepository";

export default class GetNotificationData {
  private notificationRepository: NotificationRepository;
  private requestRepository: RequestRepository;

  constructor(notificationRepository: NotificationRepository, requestRepository: RequestRepository) {
    this.notificationRepository = notificationRepository;
    this.requestRepository = requestRepository;
  }

  public async execute(userId: string): Promise<{ notification: INotification[], friendRequest: IRequest | null }> {

    await this.notificationRepository.makeNotificationAsRead(userId);
    const notificationData = await this.notificationRepository.findAllById(userId);
    const friendRequests = await this.requestRepository.findFriendRequestById(userId);

    return { notification: notificationData, friendRequest: friendRequests ? friendRequests : null };

  }
}
