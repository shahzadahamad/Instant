import mongoose, { Schema, Document } from "mongoose";
import { StoryData } from "../../../application/interface/post";

export interface IStory extends Document {
  _id: string;
  userId: string;
  post: StoryData;
  caption: string;
  musicId: string;
  aspectRatio: string;
  hideLikeAndView: boolean;
  hideComment: boolean;
  likeCount: number;
  commentCount: number;
  isArchive: boolean;
}

const storySchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    story:
    {
      url: {
        type: String,
        required: true,
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
    },
    musicId: {
      type: String,
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

const StoryModal = mongoose.model<IStory>("Story", storySchema);

export default StoryModal;
