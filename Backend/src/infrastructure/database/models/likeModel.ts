import mongoose, { Schema, Document } from "mongoose";

export interface IIike extends Document {
  _id: string;
  postId?: string;
  commentId?: string;
  storyId?: string;
  likedUsers: string[];
}

const likeSchema: Schema = new Schema(
  {
    postId: {
      type: String,
    },
    commentId: {
      type: String,
    },
    storyId: {
      type: String,
    },
    likedUsers: {
      type: [String],
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LikeModel = mongoose.model<IIike>("LIke", likeSchema);

export default LikeModel;
