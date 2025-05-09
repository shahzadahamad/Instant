import { MESSAGES } from "../../../../infrastructure/constants/messages";
import SocketService from "../../../../infrastructure/service/socketService";
import { PostData } from "../../../interface/post";
import AwsS3Storage from "../../../providers/awsS3Storage";
import NotificationRepository from "../../../repositories/user/notificationRepository";
import StoryRepository from "../../../repositories/user/storyRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class CreateStory {
  private awsS3Storage: AwsS3Storage;
  private userRepository: UserRepository;
  private storyRepository: StoryRepository;
  private notificationRepository: NotificationRepository;

  constructor(userRepository: UserRepository, awsS3Storage: AwsS3Storage, storyRepository: StoryRepository, notificationRepository: NotificationRepository) {
    this.awsS3Storage = awsS3Storage;
    this.userRepository = userRepository;
    this.storyRepository = storyRepository;
    this.notificationRepository = notificationRepository;
  }

  public async execute(id: string, music: string, storyData: PostData[], type: string, files?: Express.Multer.File,): Promise<string> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_ACCESS);
    }

    let fileUrl;
    if (files) {
      fileUrl = await this.awsS3Storage.uploadFile(files, "story");
      storyData[0].url = fileUrl;
      storyData[0].type = type;
    }

    const newStory = await this.storyRepository.createStory(id, storyData[0], music,);

    SocketService.getInstance().sendNewStory(id, newStory, MESSAGES.SUCCESS.STORY_CREATED);
    return MESSAGES.SUCCESS.STORY_CREATED;
  }
}
