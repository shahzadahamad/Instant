import MessageModel, { IMessage } from "../../../infrastructure/database/models/messageModal";

export default class MessageRepository {

  public async createMessage(messageData: Partial<IMessage>): Promise<IMessage> {
    try {
      const newMessage = await new MessageModel(messageData);
      const saveMessage = await newMessage.save();
      await saveMessage.populate('senderId', 'username profilePicture fullname isOnline');
      await saveMessage.populate({
        path: 'postId',
        populate: {
          path: 'userId',
          select: 'username profilePicture isPrivateAccount fullname isOnline isVerified'
        }
      });
      return saveMessage;
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
      return await MessageModel.find({ chatId }).populate('senderId', 'username profilePicture fullname isOnline').populate({
        path: 'postId',
        populate: {
          path: 'userId',
          select: 'username profilePicture isPrivateAccount fullname isOnline isVerified'
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Chat not found!");
      }
      console.error("Unknown error finding chat");
      throw new Error("Unknown error");
    }
  }

  public async changeMessageType(postId: string): Promise<void> {
    try {
      await MessageModel.updateMany({ postId }, { $set: { type: 'unavailable' } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Chat not found!");
      }
      console.error("Unknown error finding chat");
      throw new Error("Unknown error");
    }
  }

}
