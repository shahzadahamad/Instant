import NotificationRepository from "../../../repositories/user/notificationRepository";
import UserMoreDataRepository from "../../../repositories/user/userMoreDataRepository";
import UserRepository from "../../../repositories/user/userRepository";

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
      throw new Error("User not found!");
    };

    await this.UserMoreDataRepository.removeRequest(currentUser, requestUser._id);
    await this.notificationRepository.removeNotificationByIds(currentUser, requestUser._id.toString(), 'request');

    return { status: true };

  }
}
