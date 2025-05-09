import ChatRepository from "../../../repositories/user/implements/chatRepository";
import AwsS3Storage from "../../../providers/awsS3Storage";

export default class CreateChat {
  private chatRepository: ChatRepository;
  private awsS3Storage: AwsS3Storage;

  constructor(chatRepository: ChatRepository, awsS3Storage: AwsS3Storage) {
    this.chatRepository = chatRepository;
    this.awsS3Storage = awsS3Storage;
  }

  public async execute(userIds: string[], userId: string, groupName: string, groupProfile: Express.Multer.File | undefined): Promise<string> {

    if (userIds.length === 1) {
      const isChatExist = await this.chatRepository.findChatsOfUser(userIds[0], userId);
      if (!isChatExist) {
        const members = [...userIds, userId];
        const chatData = await this.chatRepository.createChat(members);
        return chatData._id;
      }
      return isChatExist._id;
    }

    const members = [...userIds, userId];

    let fileUrl = "https://static.vecteezy.com/system/resources/previews/026/966/960/original/default-avatar-profile-icon-of-social-media-user-vector.jpg";
    if (groupProfile) {
      fileUrl = await this.awsS3Storage.uploadFile(groupProfile, "group-profile");
    }
    const chatData = await this.chatRepository.createGroupChat(members, groupName, fileUrl, userId);
    return chatData._id;
  }
}
