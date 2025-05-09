import { MESSAGES } from "../../../../infrastructure/constants/messages";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import UserMoreDataRepository from "../../../repositories/user/userMoreDataRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetFollowDetials {
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;
  private UserMoreDataRepository: UserMoreDataRepository;

  constructor(userRepository: UserRepository, friendsRepository: FriendsRepository, UserMoreDataRepository: UserMoreDataRepository) {
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
    this.UserMoreDataRepository = UserMoreDataRepository;
  }

  public async execute(followingUserId: string, followerUserUsername: string): Promise<{ follow: boolean, request: boolean }> {

    const userToFollow = await this.userRepository.findByUsername(followerUserUsername);

    if (!userToFollow) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    };

    const isAlreadyFollowing = await this.friendsRepository.isAlreadyFollowing(followingUserId, userToFollow._id.toString());

    if (isAlreadyFollowing) {
      return { follow: true, request: false };
    }

    const isRequestExist = await this.UserMoreDataRepository.isRequestExist(followingUserId, userToFollow._id.toString());

    if (isRequestExist) {
      return { follow: false, request: true };
    };

    return { follow: false, request: false };

  }
}
