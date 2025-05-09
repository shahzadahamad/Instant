import { MESSAGES } from "../../../../infrastructure/constants/messages";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class ReportPost {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string, postId: string, reason: string): Promise<string> {
    const postData = await this.postRepository.findPostById(postId);
    const userData = await this.userRepository.findById(userId);

    if (!postData) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    if (!userData) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!reason) {
      throw new Error(MESSAGES.ERROR.REASON_REQUIRED);
    }

    await this.postRepository.reportPost(postId, userData._id, userData.username, userData.profilePicture, reason);
    return MESSAGES.SUCCESS.POST_REPORTED;
  }
}
