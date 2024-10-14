import LikeModel from "../../../infrastructure/database/models/likeModel";

export default class LikeRepository {
  public async likeAndDisLikePost(
    postId: string,
    userId: string,
    status: boolean
  ) {
    try {
      await LikeModel.updateOne(
        { postId },
        status
          ? { $addToSet: { likedUsers: userId } }
          : { $pull: { likedUsers: userId } },
        { upsert: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error likeing post: ${error.message}`);
        throw new Error("Failed to like post");
      }
      console.error("Unknown error likeing post");
      throw new Error("Unknown error");
    }
  }
}
