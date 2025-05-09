import { IMessage } from "../../../../infrastructure/database/models/messageModal";

export interface IMessageRepository {
  createMessage(messageData: Partial<IMessage>): Promise<IMessage>;
  findMessageByChatId(chatId: string): Promise<IMessage[] | null>;
  changeMessageType(postId: string): Promise<void>;
}