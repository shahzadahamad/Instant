import mongoose, { Schema, Document } from "mongoose";
import { PostData } from "../../../application/interface/post";

export interface IPost extends Document {
  userId: string;
  post: PostData[];
  caption: string;
  musicId: string;
  aspectRatio: String;
  hideLikeAndView: boolean;
  hideComment: boolean;
}

const postSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    post: [
      {
        url: {
          type: String,
          require: true,
        },
        type: {
          type: String,
          required: true,
        },
        filterClass: {
          type: String,
        },
        customFilter: {
          contrast: {
            type: Number,
            required: true,
          },
          brightness: {
            type: Number,
            required: true,
          },
          saturation: {
            type: Number,
            required: true,
          },
          sepia: {
            type: Number,
            required: true,
          },
          grayScale: {
            type: Number,
            required: true,
          },
        },
        tagUsers: {
          type: [String],
        },
        isSensitive: {
          type: Boolean,
          required: true,
        },
        sensitiveContentType: {
          type: [String],
          required: true,
        },
      },
    ],
    caption: {
      type: String,
    },
    musicId: {
      type: String,
    },
    aspectRatio: {
      type: String,
      enum: ["1/1", "4/5", "16/9", "original"],
    },
    hideLikeAndView: {
      type: String,
      required: true,
    },
    hideComment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PostModal = mongoose.model<IPost>("Post", postSchema);

export default PostModal;
