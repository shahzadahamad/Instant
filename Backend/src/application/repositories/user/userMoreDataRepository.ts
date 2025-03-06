import UserMoreDataModel, { IUserMoreData } from "../../../infrastructure/database/models/userMoreDataModal";


export default class UserMoreDataRepository {
  public async friendRequest(followingUserId: string, followerUserId: string): Promise<void> {
    try {
      await UserMoreDataModel.updateOne(
        { userId: followerUserId },
        {
          $addToSet: { friendRequest: followingUserId },
        },
        {
          upsert: true
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("error follow user!");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async isRequestExist(followingUserId: string, followerUserId: string): Promise<IUserMoreData | null> {
    try {
      return await UserMoreDataModel.findOne({
        userId: followerUserId,
        friendRequest: followingUserId,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already requested this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async findFriendRequestById(userId: string): Promise<IUserMoreData | null> {
    try {
      return await UserMoreDataModel.findOne({ userId }, { friendRequest: 1 });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already requested this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async findWatchedPostsById(userId: string): Promise<IUserMoreData | null> {
    try {
      return await UserMoreDataModel.findOne({ userId }, { watchedPost: 1 });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already requested this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async updateFriendRequest(userId: string): Promise<void> {
    try {
      await UserMoreDataModel.updateOne({ userId }, { $set: { friendRequest: [] } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already requested this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async removeRequest(userId: string, userToRemove: string): Promise<void> {
    try {
      await UserMoreDataModel.updateOne({ userId }, { $pull: { friendRequest: userToRemove } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already requested this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }

  public async watchedPostAdd(userId: string, postId: string): Promise<void> {
    try {
      await UserMoreDataModel.updateOne({ userId }, { $addToSet: { watchedPost: postId } }, { upsert: true });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already requested this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }
}
