import SocketService from "../../../../infrastructure/service/socketService";
import CommentRepository from "../../../repositories/user/commentRepository";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class ReplyComment {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private commentRepository: CommentRepository;
  private notificationRepository: NotificationRepository;

  constructor(
    postRepository: PostRepository,
    userRepository: UserRepository,
    commentRepository: CommentRepository,
    notificationRepository: NotificationRepository,
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
    this.notificationRepository = notificationRepository;
  }

  public async execute(
    id: string,
    userId: string,
    commentId: string,
    comment: string
  ) {
    const commentData = await this.commentRepository.findCommentById(commentId);
    const postData = await this.postRepository.findPostById(id);
    const userData = await this.userRepository.findById(userId);

    if (!commentData) {
      throw new Error("Comment not found!");
    }

    if (!userData) {
      throw new Error("User not found!");
    }

    if (!postData) {
      throw new Error("Post not found!");
    }

    const replyComment = await this.commentRepository.replytoComment(
      id,
      userId,
      commentId,
      comment,
      userData.username,
      userData.profilePicture
    );
    await this.postRepository.updateCommentCount(id, true);
    if (postData.userId !== userId && replyComment) {
      await this.notificationRepository.sendPostCommentNotification(userId, postData.userId, postData._id.toString(), replyComment._id.toString(), `commented on your post: ${comment}`, 'commented', 'post');
      SocketService.getInstance().sendNotification(postData.userId.toString());
    }
    const words = comment.trim().split(/\s+/);
    const mentionedUsers = words.filter(word => word.startsWith("@"));

    mentionedUsers.forEach(async (username) => {
      const user = await this.userRepository.findByUsername(username.slice(1));
      if (user && userId !== user._id.toString() && replyComment && commentData.userId === user._id.toString()) {
        await this.notificationRepository.sendPostCommentNotification(userId, user._id.toString(), postData._id.toString(), replyComment._id.toString(), `mentioned you in a comment: ${comment}`, 'mentioned', 'post');
        SocketService.getInstance().sendNotification(user._id.toString());
      }
    });
    return replyComment;
  }
}
