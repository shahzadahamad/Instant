import { IUser } from "../../../../infrastructure/database/models/userModel";
import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class Search {
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;

  constructor(userRepository: UserRepository, friendsRepository: FriendsRepository) {
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
  };

  public async execute(userId: string, search: string): Promise<IUser[]> {

    const searchData = await this.userRepository.findSearchUsers(userId, search);

    const friends = await this.friendsRepository.findUserDoc(userId);

    const filterSearchData = searchData.map((user) => {
      return {
        ...user.toObject(),
        isFollowed: friends?.followings ? friends.followings.includes(user._id.toString()) : false,
      };
    });
    return filterSearchData;
  }
}
