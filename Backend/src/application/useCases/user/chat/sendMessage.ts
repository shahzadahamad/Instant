import ChatRepository from "../../../repositories/user/implements/chatRepository";
import { MESSAGES } from "../../../../infrastructure/constants/messages";
import SocketService from "../../../../infrastructure/service/socketService";
import MessageRepository from "../../../repositories/user/implements/messageRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class sendMessage {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private userRepository: UserRepository;

  constructor(chatRepository: ChatRepository, messageRepository: MessageRepository, userRepository: UserRepository) {
    this.chatRepository = chatRepository;
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
  }

  public async execute(chatId: string, userId: string, message: string, type: string): Promise<void> {

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

    const messageData = { chatId: officalChat._id, type, message, senderId: userId };

    const newMessage = await this.messageRepository.createMessage(messageData);
    let lastMessage;
    switch (newMessage.type) {
      case 'text':
        lastMessage = newMessage.message;
        break;
      case 'audio':
        lastMessage = 'seat an attachment';
        break;
      case 'photo':
        lastMessage = 'seat an attachment';
        break;
      case 'video':
        lastMessage = 'seat an attachment';
        break;
      case 'shared':
        lastMessage = 'seat an attachment';
        break;
      case 'callText':
        lastMessage = (newMessage.message === 'Audio call ended' || newMessage.message === 'Video call ended') ?
          newMessage.message : newMessage.message.split(' ').slice(1).join(" ");
        break;
      default:
        lastMessage = '';
    }
    await this.chatRepository.updateLastMessage(officalChat._id, userId, lastMessage);
    const userData = await this.userRepository.findById(userId);
    const data = { _id: userData?._id, fullname: userData?.fullname, username: userData?.username, profilePicture: userData?.profilePicture, isOnline: userData?.isOnline };
    const updateLastMessage = { fromId: data, message: lastMessage };
    officalChat.members.forEach((member) => {
      SocketService.getInstance().sendMessage(member, [newMessage], updateLastMessage);
    });
  }
}
