import { IUser } from "../../../../infrastructure/database/models/userModel";
import { IFriendsWithUserFollowingData } from "../../../interface/post";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import UserMoreDataRepository from "../../../repositories/user/userMoreDataRepository";

export default class FollowingAndFollower {
  private friendsRepository: FriendsRepository;
  private userMoreDataRepository: UserMoreDataRepository;

  constructor(friendsRepository: FriendsRepository, userMoreDataRepository: UserMoreDataRepository) {
    this.friendsRepository = friendsRepository;
    this.userMoreDataRepository = userMoreDataRepository;
  }

  public async execute(userId: string, _id: string): Promise<IFriendsWithUserFollowingData | null> {
    const users = await this.friendsRepository.findUserDoc(userId);
    const friends = await this.friendsRepository.findUserDocWithPopulateUserData(_id ? _id : userId);
    if (!friends) return null;

    friends.followings = await Promise.all(
      (friends.followings || []).map(async (user) => {
        const isRequest = await this.userMoreDataRepository.isRequestExist(userId.toString(), user._id);


        return {
          ...user.toObject(),
          isFollowed:
            users?.followings.some((following) => following.toString() === user._id.toString()) ||
            user._id.toString() === userId ||
            false,
          isRequest: (isRequest ? true : false)
        };
      })
    ) as IUser[];


    friends.followers = await Promise.all(
      (friends.followers || []).map(async (user) => {
        const isRequest = await this.userMoreDataRepository.isRequestExist(userId.toString(), user._id);

        return {
          ...user.toObject(),
          isFollowed:
          users?.followings.some((following) => following.toString() === user._id.toString()) ||
            user._id.toString() === userId ||
            false,
          isRequest: (isRequest ? true : false)
        };
      })
    ) as IUser[];
    return friends;
  }
}
