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

  public async hasUserLikedPost(postId: string, userId: string) {
    try {
      const post = await LikeModel.findOne({
        postId: postId,
        likedUsers: userId,
      });

      return !!post;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error hasUserLikedPost check: ${error.message}`);
        throw new Error("Failed to hasUserLikedPost check");
      }
      console.error("Unknown error hasUserLikedPost post");
      throw new Error("Unknown error");
    }
  }

  public async deletePostlikes(_id: string) {
    try {
      return await LikeModel.deleteOne({ postId: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete like post");
      throw new Error("Unknown error");
    }
  }
}
