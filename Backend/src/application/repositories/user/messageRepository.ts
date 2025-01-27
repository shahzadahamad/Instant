import MessageModel, { IMessage } from "../../../infrastructure/database/models/messageModal";

export default class MessageRepository {

  public async createMessage(messageData: Partial<IMessage>): Promise<IMessage> {
    try {
      const newMessage = await new MessageModel(messageData);
      return (await newMessage.save()).populate('senderId', 'username profilePicture fullname');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("message not found!");
      }
      console.error("Unknown error finding message");
      throw new Error("Unknown error");
    }
  }

  public async findMessageByChatId(chatId: string): Promise<IMessage[] | null> {
    try {
      return await MessageModel.find({ chatId }).populate('senderId', 'username profilePicture fullname');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Chat not found!");
      }
      console.error("Unknown error finding chat");
      throw new Error("Unknown error");
    }
  }

}
