import FriendsRepository from "../../../repositories/user/friendsRepository";
import RequestRepository from "../../../repositories/user/requrestRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetFollowDetials {
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;
  private requestRepository: RequestRepository;

  constructor(userRepository: UserRepository, friendsRepository: FriendsRepository, requestRepository: RequestRepository) {
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
    this.requestRepository = requestRepository;
  }

  public async execute(followingUserId: string, followerUserUsername: string): Promise<{ follow: boolean, request: boolean }> {

    const userToFollow = await this.userRepository.findByUsername(followerUserUsername);

    if (!userToFollow) {
      throw new Error("User not found!");
    };

    const isAlreadyFollowing = await this.friendsRepository.isAlreadyFollowing(followingUserId, userToFollow._id.toString());

    if (isAlreadyFollowing) {
      return { follow: true, request: false };
    }

    const isRequestExist = await this.requestRepository.isRequestExist(followingUserId, userToFollow._id.toString());

    if (isRequestExist) {
      return { follow: false, request: true };
    };

    return { follow: false, request: false };

  }
}
