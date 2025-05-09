import { MESSAGES } from "../../../../infrastructure/constants/messages";
import SocketService from "../../../../infrastructure/service/socketService";
import LikeRepository from "../../../repositories/user/likeRepository";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import PostRepository from "../../../repositories/user/postRepository";

export default class LikeOrUnlikePost {
  private postRepository: PostRepository;
  private likeRepository: LikeRepository;
  private notificationRepository: NotificationRepository;

  constructor(postRepository: PostRepository, likeRepository: LikeRepository, notificationRepository: NotificationRepository) {
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
    this.notificationRepository = notificationRepository;
  }

  public async execute(
    postId: string,
    userId: string,
    status: string
  ): Promise<string> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    if (status === "like") {
      await this.likeRepository.likeAndDisLikePost(postId, userId, true);
      await this.postRepository.handleLikes(postId, true);
      if (userId !== post.userId) {
        await this.notificationRepository.sendPostNotification(userId, post.userId, postId, 'liked you post.', 'liked', 'post');
        SocketService.getInstance().sendNotification(post.userId.toString());
      }
    } else if (status === "dislike") {
      await this.likeRepository.likeAndDisLikePost(postId, userId, false);
      await this.postRepository.handleLikes(postId, false);
      if (userId !== post.userId) {
        await this.notificationRepository.removePostNotification(userId, post.userId, postId, 'liked you post.', 'liked', 'post');
        SocketService.getInstance().clearNotification(post.userId.toString());
      }
    } else {
      throw new Error(MESSAGES.ERROR.INVALID_ACTION);
    }
    return MESSAGES.SUCCESS.ACTION_SUCCESS;
  }
}
