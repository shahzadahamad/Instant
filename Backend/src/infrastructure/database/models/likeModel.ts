import mongoose, { Schema, Document } from "mongoose";

export interface IIike extends Document {}

const likeSchema: Schema = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    commentId: {
      type: String,
      required: true,
    },
    storyId: {
      type: String,
      required: true,
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
