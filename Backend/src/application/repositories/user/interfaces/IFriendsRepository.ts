import { IFriends } from "../../../../infrastructure/database/models/friendsModal";
import { IFriendsWithUserData, IFriendsWithUserFollowingData } from "../../../interface/post";

export interface IFriendsRepository {
  followUser(followingUserId: string, followerUserId: string): Promise<void>;
  unFollowUser(followingUserId: string, followerUserId: string): Promise<void>;
  isAlreadyFollowing(followingUserId: string, followerUserId: string): Promise<IFriends | null>;
  isAlreadyFollowed(followingUserId: string, followerUserId: string): Promise<IFriends | null>;
  findUserDoc(userId: string): Promise<IFriends | null>;
  findUserDocWithPopulateUserData(userId: string): Promise<IFriendsWithUserFollowingData | null>;
  getAllFriends(): Promise<IFriends[]>;
  findUsersWithFollowing(followingIds: string[], userId: string): Promise<IFriendsWithUserData[] | []>;
  findMostFollowedUsers(userId: string[], followingIds: string[], limit: number): Promise<IFriends[]>;
}