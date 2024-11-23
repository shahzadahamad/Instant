import LikeRepository from "../../../repositories/user/likeRepository";
import PostRepository from "../../../repositories/user/postRepository";

export default class LikeOrUnlikePost {
  private postRepository: PostRepository;
  private likeRepository: LikeRepository;

  constructor(postRepository: PostRepository, likeRepository: LikeRepository) {
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
  }

  public async execute(
    postId: string,
    userId: string,
    status: string
  ): Promise<string> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error("Post not found!");
    }

    if (status === "like") {
      await this.likeRepository.likeAndDisLikePost(postId, userId, true);
      await this.postRepository.handleLikes(postId, true);
    } else if (status === "dislike") {
      await this.likeRepository.likeAndDisLikePost(postId, userId, false);
      await this.postRepository.handleLikes(postId, false);
    } else {
      throw new Error("Invalid action");
    }
    return "action successfull";
  }
}
