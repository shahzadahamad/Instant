/* eslint-disable @typescript-eslint/no-unused-vars */
import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IUser } from "../../../../infrastructure/database/models/userModel";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetUserDataByUsername {
  private userRepository: UserRepository;
  private postRepository: PostRepository;
  private friendsRepository: FriendsRepository;

  constructor(userRepository: UserRepository, postRepository: PostRepository, friendsRepository: FriendsRepository) {
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(username: string, userId: string): Promise<{
    postCount: number;
    userWithoutSensitiveInfo: Partial<IUser> | null;
    followings: number, followers: number
  }> {
    const user = await this.userRepository.findByUsername(username);
    const currentUser = await this.userRepository.findById(userId);

    if (!currentUser) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (currentUser._id.toString() === user._id.toString()) {
      return { postCount: 0, userWithoutSensitiveInfo: null, followings: 0, followers: 0 };
    }
    const postCount = await this.postRepository.getUserPostCount(user._id);
    const friendCounts = await this.friendsRepository.findUserDoc(user._id.toString());

    const { password, isBlock, ...userWithoutSensitiveInfo } = user.toObject();

    return { postCount, userWithoutSensitiveInfo, followings: friendCounts ? friendCounts.followings.length : 0, followers: friendCounts ? friendCounts.followers.length : 0 };
  }
}
