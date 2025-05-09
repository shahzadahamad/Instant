import { MESSAGES } from "../../../../infrastructure/constants/messages";
import SocketService from "../../../../infrastructure/service/socketService";
import CommentRepository from "../../../repositories/user/commentRepository";
import LikeRepository from "../../../repositories/user/likeRepository";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import PostRepository from "../../../repositories/user/postRepository";

export default class LikeOrUnlikeComment {
  private postRepository: PostRepository;
  private likeRepository: LikeRepository;
  private commentRepository: CommentRepository;
  private notificationRepository: NotificationRepository;

  constructor(
    postRepository: PostRepository,
    likeRepository: LikeRepository,
    commentRepository: CommentRepository,
    notificationRepository: NotificationRepository
  ) { this.postRepository = postRepository; this.likeRepository = likeRepository; this.commentRepository = commentRepository; this.notificationRepository = notificationRepository; }

  public async execute(postId: string, commentId: string, userId: string, status: string): Promise<string> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    const comment = await this.commentRepository.findCommentById(commentId);
    const replyComment = await this.commentRepository.findCommentReplyById(commentId);

    if (!comment && !replyComment) {
      throw new Error(MESSAGES.ERROR.COMMENT_NOT_FOUND);
    }

    if (status === "like") {
      await this.likeRepository.likeAndDisLikeComment(postId, commentId, userId, true);
      if (comment && userId !== comment.userId) {
        await this.notificationRepository.sendPostNotification(userId, comment.userId.toString(), postId, `liked you comment: ${comment.comment}.`, 'comment-liked', 'post');
        SocketService.getInstance().sendNotification(comment.userId.toString());
      } else if (replyComment && userId !== replyComment.userId) {
        await this.notificationRepository.sendPostNotification(userId, post.userId, postId, `liked you comment: ${replyComment.reply[0].comment}.`, 'comment-liked', 'post');
        SocketService.getInstance().sendNotification(replyComment.reply[0].userId.toString());
      }
    } else if (status === "dislike") {
      await this.likeRepository.likeAndDisLikeComment(postId, commentId, userId, false);
      if (comment && userId !== comment.userId) {
        await this.notificationRepository.removePostNotification(userId, comment.userId.toString(), postId, `liked you comment: ${comment.comment}.`, 'comment-liked', 'post');
        SocketService.getInstance().sendNotification(comment.userId.toString());
      } else if (replyComment && userId !== replyComment.userId) {
        await this.notificationRepository.removePostNotification(userId, post.userId, postId, `liked you comment: ${replyComment.reply[0].comment}.`, 'comment-liked', 'post');
        SocketService.getInstance().sendNotification(replyComment.reply[0].userId.toString());
      }
    } else {
      throw new Error(MESSAGES.ERROR.INVALID_ACTION);
    }
    return commentId;
  }
}
