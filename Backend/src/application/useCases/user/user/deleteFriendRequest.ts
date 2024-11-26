import NotificationRepository from "../../../repositories/user/notificationRepository";
import RequestRepository from "../../../repositories/user/requrestRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class DeleteFriendRequest {
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;
  private requestRepository: RequestRepository;

  constructor(userRepository: UserRepository, notificationRepository: NotificationRepository, requestRepository: RequestRepository) {
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
    this.requestRepository = requestRepository;
  }

  public async execute(currentUser: string, requestUserUsername: string, notificationId: string): Promise<{ status: true }> {

    const requestUser = await this.userRepository.findByUsername(requestUserUsername);

    if (!requestUser) {
      throw new Error("User not found!");
    };

    await this.requestRepository.removeRequest(currentUser, requestUser._id);
    await this.notificationRepository.removeNotificationById(notificationId);

    return { status: true };

  }
}
