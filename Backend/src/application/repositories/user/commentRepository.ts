import CommentModel, {
  IComment,
} from "../../../infrastructure/database/models/commentModel";

export default class CommentRepository {
  public async createPost(
    id: string,
    userId: string,
    comment: string
  ): Promise<IComment> {
    try {
      const newComment = await new CommentModel({
        postId: id,
        userId: userId,
        comment,
        reply: [],
      });
      await newComment.save();
      return await newComment.populate("userId", "username profilePicture");
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating comment: ${error.message}`);
        throw new Error("Failed to create comment");
      }
      console.error("Unknown error creating comment");
      throw new Error("Unknown error");
    }
  }

  public async getComments(id: string): Promise<IComment[]> {
    try {
      return await CommentModel.find({ postId: id })
        .sort({ createdAt: -1 })
        .populate("userId", "username profilePicture");
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating comment: ${error.message}`);
        throw new Error("Failed to create comment");
      }
      console.error("Unknown error creating comment");
      throw new Error("Unknown error");
    }
  }

  public async findCommentById(_id: string): Promise<IComment | null> {
    try {
      return await CommentModel.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding comment");
      throw new Error("Unknown error");
    }
  }

  public async replytoComment(
    id: string,
    userId: string,
    commentId: string,
    comment: string,
    username: string,
    profilePicture: string
  ): Promise<IComment | null> {
    try {
      return await CommentModel.findOneAndUpdate(
        { _id: commentId, postId: id },
        {
          $push: {
            reply: {
              userId,
              username,
              profilePicture,
              comment,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      ).populate("userId", "username profilePicture");
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating comment: ${error.message}`);
        throw new Error("Failed to create comment");
      }
      console.error("Unknown error creating comment");
      throw new Error("Unknown error");
    }
  }
}
