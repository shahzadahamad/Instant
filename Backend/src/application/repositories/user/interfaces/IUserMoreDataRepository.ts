import { IUserMoreData } from "../../../../infrastructure/database/models/userMoreDataModal";

export interface IUserMoreDataRepository {
  friendRequest(followingUserId: string, followerUserId: string): Promise<void>;
  isRequestExist(followingUserId: string, followerUserId: string): Promise<IUserMoreData | null>;
  findFriendRequestById(userId: string): Promise<IUserMoreData | null>;
  findWatchedPostsById(userId: string): Promise<IUserMoreData | null>;
  updateFriendRequest(userId: string): Promise<void>;
  removeRequest(userId: string, userToRemove: string): Promise<void>;
  watchedPostAdd(userId: string, postId: string): Promise<void>;
}