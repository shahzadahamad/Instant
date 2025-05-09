import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IPost } from "../../../../infrastructure/database/models/postModel";
import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class SinglePost {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository, friendsRepository: FriendsRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(userId: string, postId: string): Promise<{ data: IPost | string, status: boolean }> {
    const postData = await this.postRepository.findPostByIdWithUserData1(postId);

    if (!postData) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    const user = await this.userRepository.findById(postData.userId);

    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (user._id.toString() === userId.toString() || !user.isPrivateAccount) {
      return { data: postData, status: true };
    } else {
      const isAlreadyFollowing = await this.friendsRepository.isAlreadyFollowing(userId.toString(), user._id.toString());
      if (isAlreadyFollowing) {
        return { data: postData, status: true };
      } else {
        return { data: user.username, status: false };
      }
    }
  }
}
