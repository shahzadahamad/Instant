import mongoose, { Schema, Document } from "mongoose";
import { PostData } from "../../../application/interface/post";

export interface IPost extends Document {
  _id: string;
  userId: string;
  post: PostData[];
  caption: string;
  musicId: string;
  aspectRatio: string;
  hideLikeAndView: boolean;
  hideComment: boolean;
  likeCount: number;
  commentCount: number;
  isArchive: boolean;
}

const postSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
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
          default: false,
          required: true,
        },
        sensitiveContentType: {
          type: [],
          default: [],
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
      type: Boolean,
      required: true,
    },
    hideComment: {
      type: Boolean,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
      required: true,
    },
    commentCount: {
      type: Number,
      default: 0,
      required: true,
    },
    isArchive: {
      type: Boolean,
      default: false,
      required: true,
    },
    reportDetials: [
      {
        userId: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        profilePicture: {
          type: String,
          required: true,
        },
        reportReason: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PostModal = mongoose.model<IPost>("Post", postSchema);

export default PostModal;
