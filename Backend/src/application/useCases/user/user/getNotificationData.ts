import { INotification } from "../../../../infrastructure/database/models/notificationModal";
import { IUser } from "../../../../infrastructure/database/models/userModel";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import RequestRepository from "../../../repositories/user/requrestRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetNotificationData {
  private notificationRepository: NotificationRepository;
  private requestRepository: RequestRepository;
  private userRepository: UserRepository;

  constructor(notificationRepository: NotificationRepository, requestRepository: RequestRepository, userRepository: UserRepository) {
    this.notificationRepository = notificationRepository;
    this.requestRepository = requestRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<{ notification: INotification[], friendRequest: IUser[] | null }> {

    await this.notificationRepository.makeNotificationAsRead(userId);
    const notificationData = await this.notificationRepository.findAllById(userId);
    const friendRequests = await this.requestRepository.findFriendRequestById(userId);

    if (friendRequests) {
      const populatedFriendRequests = await this.userRepository.findUserDataWithIdInArray(friendRequests.friendRequest);
      return { notification: notificationData, friendRequest: populatedFriendRequests.length > 0 ? populatedFriendRequests : null };
    }

    return { notification: notificationData, friendRequest: null };

  }
}
