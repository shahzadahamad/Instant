import { IUser } from "../../../../infrastructure/database/models/userModel";
import { QueryType } from "../../../interface/post";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetCreatePostUserData {
  private UserRepository: UserRepository;
  private friendsRepository: FriendsRepository;

  constructor(UserRepository: UserRepository, friendsRepository: FriendsRepository) {
    this.UserRepository = UserRepository;
    this.friendsRepository = friendsRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(search: string, userData: string[], userId: string): Promise<IUser[]> {
    const followings = await this.friendsRepository.findUserDoc(userId);
    const userFollowings = followings?.followings ?? [];
    const searchRegex = new RegExp(search, "i");
    const query: QueryType = {
      $and: [
        {
          $or: [
            { username: { $regex: searchRegex } },
            { fullname: { $regex: searchRegex } },
          ],
        },
        { _id: { $nin: userData } },
      ],
    };

    const user = await this.UserRepository.find10UserBySearch(query);
    console.log(user);
    return user.filter((user) => {
      return !user.isPrivateAccount || [...userFollowings, userId].includes(user._id.toString());
    });
  }
}
