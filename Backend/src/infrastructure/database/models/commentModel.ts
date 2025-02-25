import mongoose, { Schema, Document } from "mongoose";

export interface CommentReplyData {
  _id: string
  userId: string;
  username: string;
  profilePicture: string;
  comment: string;
}

export interface IComment extends Document {
  _id: string;
  postId: string;
  userId: string;
  comment: string;
  reply: CommentReplyData[];
}

const commentSchema: Schema = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    reply: [
      {
        userId: {
          type: String,
          required: true,
          ref: "User",
        },
        username: {
          type: String,
          required: true,
        },
        profilePicture: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ userId: 1 });
commentSchema.index({ postId: 1 });
commentSchema.index({ likedUsers: 1 });

const CommentModel = mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
