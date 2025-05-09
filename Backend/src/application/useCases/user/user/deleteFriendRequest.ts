import { MESSAGES } from "../../../../infrastructure/constants/messages";
import NotificationRepository from "../../../repositories/user/implements/notificationRepository";
import UserMoreDataRepository from "../../../repositories/user/implements/userMoreDataRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class DeleteFriendRequest {
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;
  private UserMoreDataRepository: UserMoreDataRepository;

  constructor(userRepository: UserRepository, notificationRepository: NotificationRepository, UserMoreDataRepository: UserMoreDataRepository) {
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
    this.UserMoreDataRepository = UserMoreDataRepository;
  }

  public async execute(currentUser: string, requestUserUsername: string): Promise<{ status: true }> {

    const requestUser = await this.userRepository.findByUsername(requestUserUsername);

    if (!requestUser) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    };

    await this.UserMoreDataRepository.removeRequest(currentUser, requestUser._id);
    await this.notificationRepository.removeNotificationByIds(currentUser, requestUser._id.toString(), 'request');

    return { status: true };

  }
}
