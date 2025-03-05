import mongoose, { Schema, Document } from "mongoose";

export interface IUserMoreData extends Document {
  userId: string,
  friendRequest: string[];
  watchedPost: string[];
}

const userMoreDataSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    friendRequest: {
      type: [String],
      required: true,
      default: [],
    },
    watchedPost: {
      type: [String],
      required: true,
      ref: 'Post',
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const UserMoreDataModel = mongoose.model<IUserMoreData>("UserMoreData", userMoreDataSchema);

export default UserMoreDataModel;
