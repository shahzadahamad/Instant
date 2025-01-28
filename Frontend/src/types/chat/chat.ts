import { userData } from "../profile/profile";

export interface Member {
  _id: string,
  username: string,
  fullname: string,
  profilePicture: string,
  isOnline: {
    status: boolean,
    date: Date,
  };
}

export interface ChatDatas {
  chatData: ChatData
  messageData: MessageData[]
}

export interface ChatData {
  _id: string,
  type: string,
  members: Member[]
  lastMessage: {
    fromId: string,
    message: string
  },
}

export interface MessageData {
  _id: string;
  chatId: string;
  type: string,
  message: string,
  senderId: Partial<userData>;
  deletedFrom: string[]
}