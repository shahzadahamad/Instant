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
  isVerified: {
    status: boolean;
    createdAt: Date,
    expireAt: Date;
  }
}

export interface ChatDatas {
  chatData: ChatData
  messageData: MessageData[]
}

export interface ChatData {
  _id: string,
  type: string,
  profilePicture: string,
  name: string,
  admins: string[]
  createdBy: Member
  members: Member[]
  lastMessage: {
    fromId: Member,
    message: string
  },
  updatedAt: Date;
}

export interface ChatDataHeader {
  _id: string,
  type: string,
  name: string,
  username: string,
  fullname: string,
  profilePicture: string,
  isOnline: {
    status: boolean,
    date: Date,
  };
  isVerified: {
    status: boolean;
    createdAt: Date,
    expireAt: Date;
  }
}

export interface MessageData {
  _id: string;
  chatId: string;
  type: string,
  message: string,
  senderId: Partial<userData>;
  deletedFrom: string[];
  createdAt: Date;
}