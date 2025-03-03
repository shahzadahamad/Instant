import FriendsModel, { IFriends } from "../../../infrastructure/database/models/friendsModal";

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
        throw new Error("You have already following this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }
}
