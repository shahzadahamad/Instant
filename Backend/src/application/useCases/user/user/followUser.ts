import { MESSAGES } from "../../../../infrastructure/constants/messages";
import SocketService from "../../../../infrastructure/service/socketService";
import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import NotificationRepository from "../../../repositories/user/implements/notificationRepository";
import UserMoreDataRepository from "../../../repositories/user/implements/userMoreDataRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class FollowUser {
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

  public async execute(followingUserId: string, followerUserUsername: string): Promise<{ follow: boolean, request: boolean }> {

    const userToFollow = await this.userRepository.findByUsername(followerUserUsername);

    if (!userToFollow) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    };

    const isAlreadyFollowing = await this.friendsRepository.isAlreadyFollowing(followingUserId, userToFollow._id.toString());

    if (!isAlreadyFollowing) {

      const isAlreadyFollowed = await this.friendsRepository.isAlreadyFollowed(followingUserId, userToFollow._id.toString());

      if (userToFollow.isPrivateAccount) {

        const isRequestExist = await this.UserMoreDataRepository.isRequestExist(followingUserId, userToFollow._id.toString());

        if (!isRequestExist) {

          if (isAlreadyFollowed) {
            await this.notificationRepository.editAllNotificationOfRelationFollow(followingUserId, userToFollow._id.toString(), 'requested', 'follow');
          }

          await this.UserMoreDataRepository.friendRequest(followingUserId, userToFollow._id.toString());
          await this.notificationRepository.send(followingUserId, userToFollow._id.toString(), 'request to follow you.', 'request', 'follow');
          SocketService.getInstance().sendNotification(userToFollow._id.toString());
          return { follow: false, request: true };

        }

        return { follow: false, request: true };

      } else {

        if (isAlreadyFollowed) {
          await this.notificationRepository.editAllNotificationOfRelationFollow(followingUserId, userToFollow._id.toString(), 'followed', 'follow');
        }

        const isRequestExist = await this.UserMoreDataRepository.isRequestExist(userToFollow._id.toString(), followingUserId);
        await this.friendsRepository.followUser(followingUserId, userToFollow._id.toString());
        await this.notificationRepository.send(followingUserId, userToFollow._id.toString(), 'started following you.', `${isRequestExist ? "requested" : isAlreadyFollowed ? "followed" : "follow"}`, 'follow');
        SocketService.getInstance().sendNotification(userToFollow._id.toString());
        return { follow: true, request: false };

      }

    }

    return { follow: true, request: false };
  }
}
