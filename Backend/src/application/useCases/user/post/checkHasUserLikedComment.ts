import { MESSAGES } from "../../../../infrastructure/constants/messages";
import LikeRepository from "../../../repositories/user/implements/likeRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";

export default class CheckHasUserLikedComment {
  private postRepository: PostRepository;
  private likeRepository: LikeRepository;

  constructor(postRepository: PostRepository, likeRepository: LikeRepository) {
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
  }

  public async execute(postId: string, userId: string, commentIds: string[]): Promise<{ [key: string]: { liked: boolean; count: number } }> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    const checking = await this.likeRepository.hasUserLikedComment(postId, userId, commentIds);
    return checking;
  }
}
