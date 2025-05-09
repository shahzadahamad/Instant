import ChatRepository from "../../../repositories/user/implements/chatRepository";
import { IChat } from "../../../../infrastructure/database/models/chatModal";

export default class ChatById {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(id: string): Promise<IChat | null> {

    const chatList = await this.chatRepository.findChatById(id, false);
    return chatList;

  }
}