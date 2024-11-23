import RequestModel, { IRequest } from "../../../infrastructure/database/models/requestModal";


export default class RequestRepository {
  public async friendRequest(followingUserId: string, followerUserId: string): Promise<void> {
    try {
      await RequestModel.updateOne(
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

  public async isRequestExist(followingUserId: string, followerUserId: string): Promise<IRequest | null> {
    try {
      return await RequestModel.findOne({
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

  public async findFriendRequestById(userId: string): Promise<IRequest | null> {
    try {
      return await RequestModel.findOne({ userId }, { friendRequest: 1 });
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
      await RequestModel.updateOne({ userId }, { $set: { friendRequest: [] } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("You have already requested this user.");
      }
      console.error("Unknown error following user");
      throw new Error("Unknown error");
    }
  }
}
