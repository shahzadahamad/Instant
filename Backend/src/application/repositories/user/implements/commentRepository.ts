import CommentModel, {
  CommentReplyData,
  IComment,
} from "../../../../infrastructure/database/models/commentModel";
import { ICommentRepository } from "../interfaces/ICommentRepository";

export default class CommentRepository implements ICommentRepository {
  public async createComment(id: string, userId: string, comment: string): Promise<IComment> {
    try {
      const newComment = await new CommentModel({
        postId: id,
        userId: userId,
        comment,
        reply: [],
      });
      const saveComment = await newComment.save();
      await saveComment.populate("userId", "username profilePicture isVerified");
      await saveComment.populate({ path: "reply.userId", select: "username profilePicture isVerified" });
      return saveComment;
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
        .populate("userId", "username profilePicture isVerified")
        .populate({
          path: "reply.userId",
          select: "username profilePicture isVerified",
        });
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

  public async findCommentReplyById(_id: string): Promise<IComment | null> {
    try {
      return await CommentModel.findOne({ "reply._id": _id },
        { reply: { $elemMatch: { _id: _id } } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding comment");
      throw new Error("Unknown error");
    }
  }

  public async replytoComment(id: string, userId: string, commentId: string, comment: string, username: string, profilePicture: string): Promise<IComment | null> {
    try {
      return await CommentModel.findOneAndUpdate(
        { _id: commentId, postId: id },
        {
          $push: {
            reply: {
              userId,
              postId: id,
              username,
              profilePicture,
              comment,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      ).populate("userId", "username profilePicture isVerified")
        .populate({
          path: "reply.userId",
          select: "username profilePicture isVerified",
        });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating comment: ${error.message}`);
        throw new Error("Failed to create comment");
      }
      console.error("Unknown error creating comment");
      throw new Error("Unknown error");
    }
  }

  public async deletePostComments(_id: string) {
    try {
      return await CommentModel.deleteMany({ postId: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete like post");
      throw new Error("Unknown error");
    }
  }

  public async deleteComment(_id: string): Promise<void> {
    try {
      const deleteResult = await CommentModel.deleteOne({ _id });

      if (deleteResult.deletedCount > 0) {
        return;
      }

      await CommentModel.updateOne(
        { "reply._id": _id },
        { $pull: { reply: { _id } } }
      );

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete like post");
      throw new Error("Unknown error");
    }
  }

  public async findcommentOrReplyIdById(_id: string): Promise<IComment | CommentReplyData | null> {
    try {
      const comment = await CommentModel.findOne({ _id });
      if (comment) {
        return comment;
      }


      const replyMatch = await CommentModel.findOne({
        reply: { $elemMatch: { _id: _id } }
      }, { "reply.$": 1 });

      return replyMatch ? replyMatch.reply[0] : null;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete like post");
      throw new Error("Unknown error");
    }
  }
}
