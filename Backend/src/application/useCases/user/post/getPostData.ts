import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IpostWithUserData } from "../../../interface/post";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetPostData {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string, postId: string): Promise<IpostWithUserData | null> {
    const postData = await this.postRepository.findPostById(postId);
    const userData = await this.userRepository.findById(userId);

    if (!postData) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    if (!userData) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (userData?._id.toString() !== postData?.userId.toString()) {
      throw new Error(MESSAGES.ERROR.INVALID_ACTION);
    }

    const data = await this.postRepository.findPostByIdWithUserData(postId);
    return data;
  }
}
