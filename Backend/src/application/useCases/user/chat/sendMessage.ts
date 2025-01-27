import ChatRepository from "../../../../application/repositories/user/chatRepository";
import SocketService from "../../../../infrastructure/service/socketService";
import MessageRepository from "../../../repositories/user/messageRepository";

export default class sendMessage {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;

  constructor(chatRepository: ChatRepository, messageRepository: MessageRepository) {
    this.chatRepository = chatRepository;
    this.messageRepository = messageRepository;
  }

  public async execute(chatId: string, userId: string, targetUserId: string, message: string): Promise<void> {

    const chat = await this.chatRepository.findChatById(chatId, false);

    const type = 'text';

    if (!chat) {
      throw new Error("Chat not found.");
    }

    if (!chat.members.includes(userId && targetUserId)) {
      throw new Error('User is not a member of this chat.');
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
        lastMessage = 'audio';
        break;
      case 'photo':
        lastMessage = 'photo';
        break;
      case 'video':
        lastMessage = 'video';
        break;
      case 'shared':
        lastMessage = 'shared';
        break;
      default:
        lastMessage = '';
    }
    await this.chatRepository.updateLastMessage(chat._id, userId, lastMessage);
    const updateLastMessage = { fromId: userId, message: lastMessage };
    SocketService.getInstance().sendMessage(userId, newMessage, updateLastMessage);
    SocketService.getInstance().sendMessage(targetUserId, newMessage, updateLastMessage);

  }
}
