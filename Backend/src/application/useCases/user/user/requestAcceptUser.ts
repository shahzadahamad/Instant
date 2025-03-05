import SocketService from "../../../../infrastructure/service/socketService";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import UserMoreDataRepository from "../../../repositories/user/userMoreDataRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class RequestAcceptUser {
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;
  private notificationRepository: NotificationRepository;
  private UserMoreDataRepository: UserMoreDataRepository;

  constructor(userRepository: UserRepository, friendsRepository: FriendsRepository, notificationRepository: NotificationRepository, UserMoreDataRepository: UserMoreDataRepository) {
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
    this.notificationRepository = notificationRepository;
    this.UserMoreDataRepository = UserMoreDataRepository;
  }

  public async execute(followingUserId: string, followerUserUsername: string): Promise<{ status: true }> {

    const userToFollow = await this.userRepository.findByUsername(followerUserUsername);

    if (!userToFollow) {
      throw new Error("User not found!");
    };

    const isAlreadyFollowing = await this.friendsRepository.isAlreadyFollowing(followingUserId, userToFollow._id.toString());
    const isAlreadyFollowed = await this.friendsRepository.isAlreadyFollowing(followingUserId, userToFollow._id.toString());
    await this.UserMoreDataRepository.removeRequest(followingUserId, userToFollow._id.toString());
    const isRequestExist = await this.UserMoreDataRepository.isRequestExist(followingUserId, userToFollow._id.toString());
    const isRequestExistOtherUser = await this.UserMoreDataRepository.isRequestExist(userToFollow._id.toString(), followingUserId);
    await this.friendsRepository.followUser(userToFollow._id.toString(), followingUserId);
    await this.notificationRepository.editMessageByIds(followingUserId, userToFollow._id.toString(), 'request', 'started following you.');
    await this.notificationRepository.editAllNotificationOfRelationFollow(followingUserId, userToFollow._id.toString(), `${isRequestExist ? "requested" : isAlreadyFollowing ? "followed" : "follow"}`, 'follow');
    await this.notificationRepository.editAllNotificationOfRelationFollow(userToFollow._id.toString(), followingUserId, `${isRequestExist ? "request" : isRequestExistOtherUser ? "requested" : isAlreadyFollowed ? "followed" : "follow"}`, 'follow');
    await this.notificationRepository.send(followingUserId, userToFollow._id.toString(), 'accepted your follow request.', 'followed', 'follow');
    SocketService.getInstance().sendNotification(userToFollow._id.toString());
    return { status: true };

  }
}
