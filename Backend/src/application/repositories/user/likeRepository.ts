import LikeModel from "../../../infrastructure/database/models/likeModel";

export default class LikeRepository {
  public async likeAndDisLikePost(
    postId: string,
    userId: string,
    status: boolean
  ) {
    try {
      await LikeModel.updateOne(
        { postId, commentId: { $exists: false } },
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

  public async likeAndDisLikeComment(
    postId: string,
    commentId: string,
    userId: string,
    status: boolean
  ) {
    try {
      await LikeModel.updateOne(
        { postId: postId, commentId: commentId },
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
        commentId: { $exists: false },
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

  public async hasUserLikedComment(
    postId: string,
    userId: string,
    commentIds: string[]
  ): Promise<{ [key: string]: { liked: boolean; count: number } }> {
    try {
      const likedComments = await LikeModel.find({
        postId: postId,
        commentId: { $in: commentIds },
      });

      const likedCommentMap = commentIds.reduce((acc, commentId) => {
        const likedComment = likedComments.find(
          (comment) => comment.commentId === commentId
        );
        acc[commentId] = {
          liked: likedComment
            ? likedComment.likedUsers.includes(userId)
            : false,
          count: likedComment ? likedComment.likedUsers.length : 0,
        };
        return acc;
      }, {} as { [key: string]: { liked: boolean; count: number } });

      return likedCommentMap;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error hasUserLikedComments check: ${error.message}`);
        throw new Error("Failed to check if user liked comments");
      }
      console.error("Unknown error hasUserLikedComments check");
      throw new Error("Unknown error");
    }
  }

  public async deletePostlikes(_id: string) {
    try {
      return await LikeModel.deleteMany({ postId: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete like post");
      throw new Error("Unknown error");
    }
  }

  public async deleteCommentlikes(_id: string) {
    try {
      return await LikeModel.deleteOne({ commentId: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete like comment");
      throw new Error("Unknown error");
    }
  }

  public async findLikedPostUser(userId: string) {
    try {
      return await LikeModel.find({
        postId: { $exists: true },
        likedUsers: userId,
      }, { postId: 1, _id: 0 }).then(docs => docs.map(doc => doc.postId?.toString()));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete like comment");
      throw new Error("Unknown error");
    }
  }
}
