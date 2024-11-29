import { GetUserDataForPost, PostData } from "../profile/profile"

export interface NotificationType {
  _id: string
  userId: string,
  fromId: GetUserDataForPost,
  postId: {
    _id: string,
    post: PostData[]
  }
  type: string,
  message: string,
  relation: string,
  read: boolean,
  createdAt: Date,
}

export interface UnfollowModalProps {
  openUnfollowModal: boolean,
  handleUnfollowModal: (status: boolean) => void;
  userData: GetUserDataForPost;
}

export interface FriendRequestModalProps {
  openFriendRequestModal: boolean
  handleFriendRequest: (status: boolean) => void;
  friendRequest: GetUserDataForPost[];
}