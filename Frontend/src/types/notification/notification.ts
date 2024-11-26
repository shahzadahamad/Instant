import { GetUserDataForPost } from "../profile/profile"

export interface NotificationType {
  _id: string
  userId: string,
  fromId: GetUserDataForPost,
  type: string,
  message: string,
  read: boolean,
  createdAt: Date,
}

export interface friendRequestType {
  _id: string;
  friendRequest: string[]
}

export interface UnfollowModalProps {
  openUnfollowModal: boolean,
  handleUnfollowModal: (status: boolean) => void;
  userData: GetUserDataForPost;
}