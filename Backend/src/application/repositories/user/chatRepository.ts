import ChatModel, { IChat } from "../../../infrastructure/database/models/chatModal";

export default class ChatRepository {

  public async findChatById(_id: string): Promise<IChat | null> {
    try {

      return await ChatModel.findOne({ _id }).populate('members', 'username profilePicture fullname');

    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Chat not found!");
      }
      console.error("Unknown error finding chat");
      throw new Error("Unknown error");
    }
  }

  public async createChat(members: string[]): Promise<IChat> {
    try {

      const newChat = await new ChatModel({
        members,
        type: 'personal',
        lastMessage: ""
      });

      return await newChat.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async findChatsOfUser(user1: string, user2: string): Promise<IChat | null> {
    try {
      return await ChatModel.findOne({ members: { $all: [user1, user2] }, type: 'personal' });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async findChatsList(userId: string, type: string): Promise<IChat[] | null> {
    try {
      return await ChatModel.find({ members: userId, type: type }).populate('members', 'username profilePicture fullname')
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }
}
