/* eslint-disable @typescript-eslint/no-unused-vars */
import CommentRepository from "../../../repositories/user/commentRepository";
import LikeRepository from "../../../repositories/user/likeRepository";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import PostRepository from "../../../repositories/user/postRepository";


export default class DeleteCommentOrReply {
  private likeRepository: LikeRepository;
  private commentRepository: CommentRepository;
  private notificationRepository: NotificationRepository;
  private postRepository: PostRepository;

  constructor(
    likeRepository: LikeRepository,
    commentRepository: CommentRepository,
    notificationRepository: NotificationRepository,
    postRepository: PostRepository
  ) {
    this.likeRepository = likeRepository;
    this.commentRepository = commentRepository;
    this.notificationRepository = notificationRepository;
    this.postRepository = postRepository;
  }

  public async execute(commentOrReplyId: string, actionFor: string, userId: string): Promise<{ commentId: string, message: string }> {

    const commentOrReplyExist = await this.commentRepository.findcommentOrReplyIdById(commentOrReplyId);

    if (!commentOrReplyExist) {
      throw new Error("Comment not found!");
    }

    if ('reply' in commentOrReplyExist) {
      commentOrReplyExist.reply.forEach(async (item) => {
        await this.likeRepository.deleteCommentlikes(item._id);
      });
    }
    await this.likeRepository.deleteCommentlikes(commentOrReplyExist._id);
    await this.commentRepository.deleteComment(commentOrReplyExist._id);
    await this.notificationRepository.removeCommentNotificationByCommentId(commentOrReplyExist._id);
    await this.postRepository.updateCommentCount(commentOrReplyExist.postId, false);

    return { commentId: commentOrReplyExist._id, message: "Comment deleted." };
  }
}
