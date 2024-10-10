import { PostData } from "../../../interface/post";
import AwsS3Storage from "../../../providers/awsS3Storage";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class CreatePost {
  private awsS3Storage: AwsS3Storage;
  private userRepository: UserRepository;
  private postRepository: PostRepository;

  constructor(
    userRepository: UserRepository,
    awsS3Storage: AwsS3Storage,
    postRepository: PostRepository
  ) {
    this.awsS3Storage = awsS3Storage;
    this.userRepository = userRepository;
    this.postRepository = postRepository;
  }

  public async execute(
    id: string,
    caption: string,
    aspectRatio: string,
    hideLikeAndView: boolean,
    hideComment: boolean,
    music: string,
    postData: PostData[],
    files?:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined
  ): Promise<string> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("Invalied Access!");
    }

    if (files) {
      if (Array.isArray(files)) {
        await Promise.all(
          files.map(async (file, index) => {
            const fileUrl = await this.awsS3Storage.uploadFile(file, "post");
            postData[index].url = fileUrl;
            if (postData[index].type === "image") {
              const checkImageModeration =
                await this.awsS3Storage.checkImageModeration(fileUrl);
              postData[index].isSensitive =
                checkImageModeration.isInappropriate;
              postData[index].sensitiveContentType =
                checkImageModeration.labels;
            } else if (postData[index].type === "video") {
              const jobId = await this.awsS3Storage.checkVideoModeration(
                fileUrl
              );
              if (jobId) {
                const videoModerationLabels =
                  await this.awsS3Storage.getVideoModerationResults(jobId);
                postData[index].isSensitive =
                  videoModerationLabels.isInappropriate;
                postData[index].sensitiveContentType =
                  videoModerationLabels.labels;
              }
            }
          })
        );
      }
    }

    await this.postRepository.createPost(
      id,
      postData,
      caption,
      music,
      hideLikeAndView,
      hideComment,
      aspectRatio
    );

    return "Post created successfully";
  }
}
