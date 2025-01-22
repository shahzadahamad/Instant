import ChatRepository from "../../../../application/repositories/user/chatRepository";
import { IChat } from "../../../../infrastructure/database/models/chatModal";

export default class GetIndividualChatData {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(id: string): Promise<IChat> {

    const isChatExist = await this.chatRepository.findChatById(id);

    if (isChatExist)
      return isChatExist;
    else
      throw new Error("Chat not found!");

  }
}
