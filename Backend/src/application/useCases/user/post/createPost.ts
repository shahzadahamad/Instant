import { MESSAGES } from "../../../../infrastructure/constants/messages";
import SocketService from "../../../../infrastructure/service/socketService";
import { PostData } from "../../../interface/post";
import AwsS3Storage from "../../../providers/awsS3Storage";
import NotificationRepository from "../../../repositories/user/implements/notificationRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class CreatePost {
  private awsS3Storage: AwsS3Storage;
  private userRepository: UserRepository;
  private postRepository: PostRepository;
  private notificationRepository: NotificationRepository;

  constructor(userRepository: UserRepository, awsS3Storage: AwsS3Storage, postRepository: PostRepository, notificationRepository: NotificationRepository) {
    this.awsS3Storage = awsS3Storage;
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.notificationRepository = notificationRepository;
  }

  public async execute(id: string, caption: string, aspectRatio: string, hideLikeAndView: boolean, hideComment: boolean, music: string, postData: PostData[], files?: | Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined): Promise<string> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_ACCESS);
    }

    if (files) {
      if (Array.isArray(files)) {
        await Promise.all(
          files.map(async (file, index) => {
            const fileUrl = await this.awsS3Storage.uploadFile(file, "post");
            postData[index].url = fileUrl;
            // if (postData[index].type === "image") {
            //   const checkImageModeration =
            //     await this.awsS3Storage.checkImageModeration(fileUrl);
            //   postData[index].isSensitive =
            //     checkImageModeration.isInappropriate;
            //   postData[index].sensitiveContentType =
            //     checkImageModeration.labels;
            // } else if (postData[index].type === "video") {
            //   const jobId = await this.awsS3Storage.checkVideoModeration(
            //     fileUrl
            //   );
            //   if (jobId) {
            //     const videoModerationLabels =
            //       await this.awsS3Storage.getVideoModerationResults(jobId);
            //     postData[index].isSensitive =
            //       videoModerationLabels.isInappropriate;
            //     postData[index].sensitiveContentType =
            //       videoModerationLabels.labels;
            //   }
            // }
          })
        );
      }
    }

    const newPost = await this.postRepository.createPost(id, postData, caption, music, hideLikeAndView, hideComment, aspectRatio);

    const notifiedUsers = new Set();
    newPost.post.forEach((post) => {
      post.tagUsers.forEach(async (user) => {
        if (!notifiedUsers.has(user)) {
          notifiedUsers.add(user);
          await this.notificationRepository.sendPostNotification(id, user, newPost._id, 'tagged you in a post.', 'tagged', 'post');
          SocketService.getInstance().sendNotification(user.toString());
        }
      });
    });

    SocketService.getInstance().sendNewPost(id, newPost, MESSAGES.SUCCESS.POST_CREATED);
    return MESSAGES.SUCCESS.POST_CREATED;
  }
}
