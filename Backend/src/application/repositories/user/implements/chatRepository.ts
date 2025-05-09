import { UpdateWriteOpResult } from "mongoose";
import ChatModel, { IChat } from "../../../../infrastructure/database/models/chatModal";
import { IChatRepository } from "../interfaces/IChatRepository";

export default class ChatRepository implements IChatRepository {

  public async findChatById(_id: string, populate: boolean): Promise<IChat | null> {
    try {

      if (populate) {
        return await ChatModel.findOne({ _id }).populate('members', 'username profilePicture fullname isOnline isVerified').populate('createdBy', 'username profilePicture fullname isOnline isVerified').populate({
          path: 'lastMessage',
          populate: {
            path: 'fromId',
            select: 'username profilePicture fullname isOnline',
          }
        });
      }

      return await ChatModel.findOne({ _id });

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


  public async createGroupChat(members: string[], name: string, profilePicture: string, admins: string): Promise<IChat> {
    try {

      const newChat = await new ChatModel({
        members,
        name,
        profilePicture,
        admins,
        createdBy: admins,
        type: 'group',
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
      if (type === 'all') {
        return await ChatModel.find({ members: userId }).populate('members', 'username profilePicture fullname isOnline isVerified').populate({
          path: 'lastMessage',
          populate: {
            path: 'fromId',
            select: 'username profilePicture fullname isOnline',
          }
        }).sort({ updatedAt: -1 });
      }
      return await ChatModel.find({ members: userId, type: type }).populate('members', 'username profilePicture fullname isOnline isVerified').populate({
        path: 'lastMessage',
        populate: {
          path: 'fromId',
          select: 'username profilePicture fullname isOnline',
        }
      }).sort({ updatedAt: -1 });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async updateLastMessage(_id: string, fromId: string, message: string): Promise<UpdateWriteOpResult> {
    try {
      return await ChatModel.updateOne({ _id }, {
        $set: {
          'lastMessage.fromId': fromId,
          'lastMessage.message': message,
        },
      }, { new: true });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }
}
