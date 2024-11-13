import SocketService from "../../../../infrastructure/service/socketService";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import RequestRepository from "../../../repositories/user/requrestRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class FollowUser {
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

  public async execute(followingUserId: string, followerUserUsername: string): Promise<{ follow: boolean, request: boolean }> {

    const userToFollow = await this.userRepository.findByUsername(followerUserUsername);

    if (!userToFollow) {
      throw new Error("User not found!");
    };

    const isFriendAlready = await this.friendsRepository.isFriendAlready(followingUserId, userToFollow._id.toString());

    if (!isFriendAlready) {

      if (userToFollow.isPrivateAccount) {

        const isRequestExist = await this.requestRepository.isRequestExist(followingUserId, userToFollow._id.toString());

        if (!isRequestExist) {
          await this.requestRepository.friendRequest(followingUserId, userToFollow._id.toString());
          await this.notificationRepository.send(followingUserId, userToFollow._id.toString(), 'request to follow you.');
          SocketService.getInstance().sendNotification(userToFollow._id.toString());
          return { follow: false, request: true };

        }

      } else {

        await this.friendsRepository.followUser(followingUserId, userToFollow._id.toString());
        await this.notificationRepository.send(followingUserId, userToFollow._id.toString(), 'started following you.');
        SocketService.getInstance().sendNotification(userToFollow._id.toString());
        return { follow: true, request: false };

      }

    }

    return { follow: true, request: false };
  }
}
