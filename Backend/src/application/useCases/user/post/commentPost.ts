import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IComment } from "../../../../infrastructure/database/models/commentModel";
import SocketService from "../../../../infrastructure/service/socketService";
import CommentRepository from "../../../repositories/user/implements/commentRepository";
import NotificationRepository from "../../../repositories/user/implements/notificationRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class CommentPost {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private commentRepository: CommentRepository;
  private notificationRepository: NotificationRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository, commentRepository: CommentRepository, notificationRepository: NotificationRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
    this.notificationRepository = notificationRepository;
  }

  public async execute(id: string, userId: string, comment: string): Promise<IComment> {
    const postData = await this.postRepository.findPostById(id);
    const userData = await this.userRepository.findById(userId);

    if (!userData) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!postData) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    const newComment = await this.commentRepository.createComment(id, userId, comment);

    await this.postRepository.updateCommentCount(id, true);
    if (postData.userId !== userId) {
      await this.notificationRepository.sendPostCommentNotification(userId, postData.userId, postData._id, newComment._id, `commented on your post: ${newComment.comment}`, 'commented', 'post');
      SocketService.getInstance().sendNotification(postData.userId.toString());
    }
    const words = comment.trim().split(/\s+/);
    const mentionedUsers = words.filter(word => word.startsWith("@"));

    mentionedUsers.forEach(async (username) => {
      const user = await this.userRepository.findByUsername(username.slice(1));
      if (user && userId !== user._id.toString()) {
        await this.notificationRepository.sendPostCommentNotification(userId, user._id, postData._id, newComment._id, `mentioned you in a comment ${newComment.comment}`, 'mentioned', 'post');
        SocketService.getInstance().sendNotification(user._id.toString());
      }
    });
    return newComment;
  }
}
