import ChatRepository from "../../../../application/repositories/user/chatRepository";

export default class CreateChat {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async execute(id: string, userId: string): Promise<string> {

    const isChatExist = await this.chatRepository.findChatsOfUser(id, userId);

    if (!isChatExist) {
      const members = [id, userId];
      const chatData = await this.chatRepository.createChat(members);
      return chatData._id;
    }

    return isChatExist._id;

  }
}
