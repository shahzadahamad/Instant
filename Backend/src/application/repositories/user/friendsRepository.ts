import FriendsModel, { IFriends } from "../../../infrastructure/database/models/friendsModal";
import { IFriendsWithUserData, IFriendsWithUserFollowingData } from "../../interface/post";

export default class FriendsRepository {
  public async followUser(followingUserId: string, followerUserId: string): Promise<void> {
    try {
      await FriendsModel.updateOne(
        { userId: followingUserId },
        {
          $addToSet: { followings: followerUserId },
        },
        {
          upsert: true
        }
      );
      await FriendsModel.updateOne(
        { userId: followerUserId },
        {
          $addToSet: { followers: followingUserId },
        },
        {
          upsert: true
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async unFollowUser(followingUserId: string, followerUserId: string): Promise<void> {
    try {
      await FriendsModel.updateOne(
        { userId: followingUserId },
        {
          $pull: { followings: followerUserId },
        }
      );
      await FriendsModel.updateOne(
        { userId: followerUserId },
        {
          $pull: { followers: followingUserId },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async isAlreadyFollowing(followingUserId: string, followerUserId: string): Promise<IFriends | null> {
    try {
      return await FriendsModel.findOne({
        userId: followingUserId,
        followings: followerUserId,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already following this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async isAlreadyFollowed(followingUserId: string, followerUserId: string): Promise<IFriends | null> {
    try {
      return await FriendsModel.findOne({
        userId: followingUserId,
        followers: followerUserId,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already following this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async findUserDoc(userId: string): Promise<IFriends | null> {
    try {
      return await FriendsModel.findOne({ userId });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async findUserDocWithPopulateUserData(userId: string): Promise<IFriendsWithUserFollowingData | null> {
    try {
      return await FriendsModel.findOne({ userId }).populate({
        path: "followings",
        select: "username profilePicture fullname isPrivateAccount isVerified",
      })
        .populate({
          path: "followers",
          select: "username profilePicture fullname isPrivateAccount isVerified",
        }) as IFriendsWithUserFollowingData | null;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        throw new Error("Error");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async findUsersWithFollowing(followingIds: string[], userId: string): Promise<IFriendsWithUserData[] | []> {
    try {
      return await FriendsModel.find({ userId: { $in: followingIds, $ne: userId } }).populate("userId", 'username') as IFriendsWithUserData[] | [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async findMostFollowedUsers(userId: string[], followingIds: string[], limit: number): Promise<IFriends[]> {
    try {
      return await FriendsModel.find(
        { userId: { $nin: [...followingIds, ...userId] } },
      ).sort({ followers: -1 })
        .limit(limit)
        .select("userId");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }
}
