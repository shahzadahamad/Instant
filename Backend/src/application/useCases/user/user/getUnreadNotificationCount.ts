import NotificationRepository from "../../../repositories/user/implements/notificationRepository";

export default class GetUnreadNotificationCount {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {

    this.notificationRepository = notificationRepository;
  }

  public async execute(userId: string): Promise<number> {
    const notificationCount = this.notificationRepository.unReadNotificationCount(userId);
    return notificationCount;
  }
}
