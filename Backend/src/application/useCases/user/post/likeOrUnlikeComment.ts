import CommentRepository from "../../../repositories/user/commentRepository";
import LikeRepository from "../../../repositories/user/likeRepository";
import PostRepository from "../../../repositories/user/postRepository";

export default class LikeOrUnlikeComment {
  private postRepository: PostRepository;
  private likeRepository: LikeRepository;
  private commentRepository: CommentRepository;

  constructor(
    postRepository: PostRepository,
    likeRepository: LikeRepository,
    commentRepository: CommentRepository
  ) {
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
    this.commentRepository = commentRepository;
  }

  public async execute(
    postId: string,
    commentId: string,
    userId: string,
    status: string
  ): Promise<any> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error("Post not found!");
    }

    const comment = await this.commentRepository.findCommentById(commentId);
    const replyComment = await this.commentRepository.findCommentReplyById(
      commentId
    );

    if (!comment && !replyComment) {
      throw new Error("Comment not found!");
    }

    if (status === "like") {
      await this.likeRepository.likeAndDisLikeComment(
        postId,
        commentId,
        userId,
        true
      );
    } else if (status === "dislike") {
      await this.likeRepository.likeAndDisLikeComment(
        postId,
        commentId,
        userId,
        false
      );
    } else {
      throw new Error("Invalid action");
    }
    return commentId;
  }
}
