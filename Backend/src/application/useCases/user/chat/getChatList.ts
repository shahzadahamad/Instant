import ChatRepository from "../../../repositories/user/implements/chatRepository";
import { IChat } from "../../../../infrastructure/database/models/chatModal";

export default class GetChatList {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(id: string, type: string): Promise<IChat[] | null> {

    const chatList = await this.chatRepository.findChatsList(id, type);
    return chatList;

  }
}
