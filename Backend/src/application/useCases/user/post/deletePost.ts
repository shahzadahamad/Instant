import { MESSAGES } from "../../../../infrastructure/constants/messages";
import AwsS3Storage from "../../../providers/awsS3Storage";
import CommentRepository from "../../../repositories/user/implements/commentRepository";
import LikeRepository from "../../../repositories/user/implements/likeRepository";
import MessageRepository from "../../../repositories/user/implements/messageRepository";
import NotificationRepository from "../../../repositories/user/implements/notificationRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class DeletePost {
  private postRepository: PostRepository;
  private awsS3Storage: AwsS3Storage;
  private likeRepository: LikeRepository;
  private userRepository: UserRepository;
  private commentRepository: CommentRepository;
  private notificationRepository: NotificationRepository;
  private messageRepository: MessageRepository;

  constructor(postRepository: PostRepository, awsS3Storage: AwsS3Storage, likeRepository: LikeRepository, userRepository: UserRepository, commentRepository: CommentRepository, notificationRepository: NotificationRepository, messageRepository: MessageRepository,) {
    this.postRepository = postRepository;
    this.awsS3Storage = awsS3Storage;
    this.likeRepository = likeRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
    this.notificationRepository = notificationRepository;
    this.messageRepository = messageRepository;
  }

  public async execute(id: string, userId: string): Promise<string> {
    const postData = await this.postRepository.findPostById(id);
    const userData = await this.userRepository.findById(userId);

    if (!userData) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!postData) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    if (userData?._id.toString() !== postData?.userId.toString()) {
      throw new Error(MESSAGES.ERROR.INVALID_ACTION);
    }

    postData.post.forEach(async (item) => {
      await this.awsS3Storage.deleteFile(item.url.toString());
    });

    await this.postRepository.deletePost(id);
    await this.likeRepository.deletePostlikes(id);
    await this.commentRepository.deletePostComments(id);
    await this.notificationRepository.removePostNotificationByPostId(id);
    await this.messageRepository.changeMessageType(id);
    return MESSAGES.SUCCESS.POST_DELECTED;
  }
}
