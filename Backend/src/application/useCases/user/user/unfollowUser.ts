import SocketService from "../../../../infrastructure/service/socketService";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import RequestRepository from "../../../repositories/user/requrestRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class UnfollowUser {
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;
  private notificationRepository: NotificationRepository;
  private requestRepository: RequestRepository;

  constructor(userRepository: UserRepository, friendsRepository: FriendsRepository, notificationRepository: NotificationRepository, requestRepository: RequestRepository) {
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
    this.notificationRepository = notificationRepository;
    this.requestRepository = requestRepository;
  }

  public async execute(currentUserId: string, unfollowUserId: string): Promise<void> {

    const unfollowingUser = await this.userRepository.findById(unfollowUserId);

    if (!unfollowingUser) {
      throw new Error("User not found!");
    };

    const result = await this.requestRepository.findFriendRequestById(unfollowingUser._id.toString());
    await this.notificationRepository.removeAllNotificationOfSingleUser(unfollowingUser._id.toString(), currentUserId, 'follow');

    if (result?.friendRequest.includes(currentUserId)) {
      await this.requestRepository.removeRequest(unfollowingUser._id.toString(), currentUserId);
    }

    await this.notificationRepository.removeNotificationOfUserByMessage(currentUserId, unfollowingUser._id, 'accepted your follow request.');
    await this.notificationRepository.editAllNotificationOfRelationFollow(currentUserId, unfollowingUser._id.toString(), 'follow', 'follow');
    await this.friendsRepository.unFollowUser(currentUserId, unfollowingUser._id.toString());
    SocketService.getInstance().clearNotification(unfollowingUser._id.toString());
  }
}
