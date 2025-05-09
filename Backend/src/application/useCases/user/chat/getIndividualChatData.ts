import ChatRepository from "../../../repositories/user/implements/chatRepository";
import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IChat } from "../../../../infrastructure/database/models/chatModal";
import { IMessage } from "../../../../infrastructure/database/models/messageModal";
import MessageRepository from "../../../repositories/user/implements/messageRepository";

export default class GetIndividualChatData {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;

  constructor(chatRepository: ChatRepository, messageRepository: MessageRepository) {
    this.chatRepository = chatRepository;
    this.messageRepository = messageRepository;
  }

  public async execute(id: string): Promise<{ messageData: IMessage[], chatData: IChat }> {

    const isChatExist = await this.chatRepository.findChatById(id, true);

    if (isChatExist) {
      const messages = await this.messageRepository.findMessageByChatId(isChatExist._id);
      return { messageData: messages ? messages : [], chatData: isChatExist };
    }
    else
      throw new Error(MESSAGES.ERROR.CHAT_NOT_FOUND);

  }
}
