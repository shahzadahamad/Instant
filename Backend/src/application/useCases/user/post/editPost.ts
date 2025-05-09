import { MESSAGES } from "../../../../infrastructure/constants/messages";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class EditPost {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string, postId: string, caption: string, hideLikesAndViewCount: boolean, turnOffCounting: boolean): Promise<string> {
    const postData = await this.postRepository.findPostById(postId);
    const userData = await this.userRepository.findById(userId);

    if (!postData) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    if (!userData) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (userData._id.toString() !== postData.userId.toString()) {
      throw new Error(MESSAGES.ERROR.INVALID_ACTION);
    }

    await this.postRepository.updatePost(postId, caption, hideLikesAndViewCount, turnOffCounting);
    return MESSAGES.SUCCESS.POST_UPDATED;
  }
}
