import ChatRepository from "../../../../application/repositories/user/chatRepository";
import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IMessage } from "../../../../infrastructure/database/models/messageModal";
import SocketService from "../../../../infrastructure/service/socketService";
import AwsS3Storage from "../../../providers/awsS3Storage";
import MessageRepository from "../../../repositories/user/messageRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class FileMessage {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private userRepository: UserRepository;
  private awsS3Storage: AwsS3Storage;

  constructor(chatRepository: ChatRepository, messageRepository: MessageRepository, userRepository: UserRepository, awsS3Storage: AwsS3Storage) {
    this.chatRepository = chatRepository;
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
    this.awsS3Storage = awsS3Storage;
  }

  public async execute(chatId: string, userId: string, files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined): Promise<boolean> {

    const chat = await this.chatRepository.findChatById(chatId, false);
    const userChat = await this.chatRepository.findChatsOfUser(chatId, userId);

    if (!chat && !userChat) {
      throw new Error(MESSAGES.ERROR.CHAT_NOT_FOUND);
    }

    const officalChat = chat ? chat : userChat;

    if (!officalChat) {
      throw new Error(MESSAGES.ERROR.CHAT_NOT_FOUND);
    }

    if (chat) {
      if (!chat?.members.includes(userId)) {
        throw new Error(MESSAGES.ERROR.NOT_MEMBER_IN_CHAT);
      }
    } else {
      if (!userChat?.members.includes(userId) && !userChat?.members.includes(chatId)) {
        throw new Error(MESSAGES.ERROR.NOT_MEMBER_IN_CHAT);
      }
    }
    const lastMessage = 'seat an attachment';
    const newMessages: IMessage[] = [];
    if (files) {
      if (Array.isArray(files)) {
        await Promise.all(
          files.map(async (file) => {
            const fileUrl = await this.awsS3Storage.uploadFile(file, "message-files");
            const fileType = file.mimetype;
            let fileCategory;
            if (fileType.startsWith('image/')) {
              fileCategory = "image";
            } else if (fileType.startsWith('video/')) {
              fileCategory = "video";
            } else if (fileType.startsWith('audio/')) {
              fileCategory = "audio";
            } else {
              fileCategory = "unknown";
            }
            const messageData = { chatId: officalChat._id, type: fileCategory, message: fileUrl, senderId: userId };
            const newMessage = await this.messageRepository.createMessage(messageData);
            newMessages.push(newMessage);
          })
        );
      }
    }

    await this.chatRepository.updateLastMessage(officalChat._id, userId, lastMessage);
    const userData = await this.userRepository.findById(userId);
    const data = { _id: userData?._id, fullname: userData?.fullname, username: userData?.username, profilePicture: userData?.profilePicture, isOnline: userData?.isOnline };
    const updateLastMessage = { fromId: data, message: lastMessage };
    officalChat.members.forEach((member) => {
      SocketService.getInstance().sendMessage(member, newMessages, updateLastMessage);
    });
    return true;
  }
}
