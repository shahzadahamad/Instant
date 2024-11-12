import FriendsModel from "../../../infrastructure/database/models/friendsModal";

export default class FriendsRepository {
  public async followUser(followingUserId: string, followerUserId: string): Promise<void> {
    try {
      await FriendsModel.updateOne(
        { userId: followingUserId },
        {
          $addToSet: { following: followerUserId },
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
}
