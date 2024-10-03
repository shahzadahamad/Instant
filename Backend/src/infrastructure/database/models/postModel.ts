import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  otp: string;
  expiresAt: Date;
}

const postSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
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
          required: true,
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
        tags: [mongoose.Schema.ObjectId],
        isSensitive: {
          type: Boolean,
          required: true,
        },
        sensitiveContentType: {
          type: String,
          required: true,
        },
      },
    ],
    caption: {
      type: String,
      default: "",
    },
    musicId: {
      type: mongoose.Schema.ObjectId,
    },
    aspectRatio: {
      type: String,
      enum: ["1/1", "4/5", "16/9"],
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
