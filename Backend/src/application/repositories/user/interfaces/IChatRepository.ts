import { UpdateWriteOpResult } from "mongoose";
import { IChat } from "../../../../infrastructure/database/models/chatModal";

export interface IChatRepository {
  findChatById(_id: string, populate: boolean): Promise<IChat | null>;
  createChat(members: string[]): Promise<IChat>;
  createGroupChat(members: string[], name: string, profilePicture: string, admins: string): Promise<IChat>;
  findChatsOfUser(user1: string, user2: string): Promise<IChat | null>;
  findChatsList(userId: string, type: string): Promise<IChat[] | null>;
  updateLastMessage(_id: string, fromId: string, message: string): Promise<UpdateWriteOpResult>;
}