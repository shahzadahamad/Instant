import ChatRepository from "../../../../application/repositories/user/chatRepository";
import SocketService from "../../../../infrastructure/service/socketService";
import MessageRepository from "../../../repositories/user/messageRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class sendMessage {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private userRepository: UserRepository;

  constructor(chatRepository: ChatRepository, messageRepository: MessageRepository, userRepository: UserRepository) {
    this.chatRepository = chatRepository;
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
  }

  public async execute(chatId: string, userId: string, message: string): Promise<void> {

    const chat = await this.chatRepository.findChatById(chatId, false);

    const type = 'text';

    if (!chat) {
      throw new Error("Chat not found.");
    }

    if (!chat.members.includes(userId)) {
      throw new Error('You are not a member of this chat.');
    }

    const messageData = {
      chatId,
      type,
      message,
      senderId: userId,
    };

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
      default:
        lastMessage = '';
    }
    await this.chatRepository.updateLastMessage(chat._id, userId, lastMessage);
    const userData = await this.userRepository.findById(userId);
    const data = {
      _id: userData?._id,
      fullname: userData?.fullname,
      username: userData?.username,
      profilePicture: userData?.profilePicture,
      isOnline: userData?.isOnline
    };
    const updateLastMessage = { fromId: data, message: lastMessage };
    chat.members.forEach((member) => {
      SocketService.getInstance().sendMessage(member, newMessage, updateLastMessage);
    });
  }
}
