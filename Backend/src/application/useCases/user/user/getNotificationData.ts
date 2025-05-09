import { INotification } from "../../../../infrastructure/database/models/notificationModal";
import { IUser } from "../../../../infrastructure/database/models/userModel";
import NotificationRepository from "../../../repositories/user/implements/notificationRepository";
import UserMoreDataRepository from "../../../repositories/user/implements/userMoreDataRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class GetNotificationData {
  private notificationRepository: NotificationRepository;
  private UserMoreDataRepository: UserMoreDataRepository;
  private userRepository: UserRepository;

  constructor(notificationRepository: NotificationRepository, UserMoreDataRepository: UserMoreDataRepository, userRepository: UserRepository) {
    this.notificationRepository = notificationRepository;
    this.UserMoreDataRepository = UserMoreDataRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<{ notification: INotification[], friendRequest: IUser[] | null }> {

    await this.notificationRepository.makeNotificationAsRead(userId);
    const notificationData = await this.notificationRepository.findAllById(userId);
    const friendRequests = await this.UserMoreDataRepository.findFriendRequestById(userId);

    if (friendRequests) {
      const populatedFriendRequests = await this.userRepository.findUserDataWithIdInArray(friendRequests.friendRequest);
      return { notification: notificationData, friendRequest: populatedFriendRequests.length > 0 ? populatedFriendRequests : null };
    }

    return { notification: notificationData, friendRequest: null };

  }
}
