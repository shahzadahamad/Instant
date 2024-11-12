import SocketService from "../../../../infrastructure/service/socketService";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class FollowUser {
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;
  private notificationRepository: NotificationRepository;

  constructor(userRepository: UserRepository, friendsRepository: FriendsRepository, notificationRepository: NotificationRepository) {
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
    this.notificationRepository = notificationRepository;
  }

  public async execute(followingUserId: string, followerUserUsername: string): Promise<boolean> {
    const userToFollow = await this.userRepository.findByUsername(followerUserUsername);
    if (!userToFollow) {
      throw new Error("User not found!");
    };
    if (userToFollow.isPrivateAccount) {
      throw new Error('private account!');
    } else {
      await this.friendsRepository.followUser(followingUserId, userToFollow._id);
      await this.notificationRepository.followUser(followingUserId, userToFollow._id);

      SocketService.getInstance().sendNotification(userToFollow._id);

      return true;
    }
  }
}
