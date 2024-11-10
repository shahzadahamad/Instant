import mongoose, { Schema, Document } from "mongoose";

export interface IFriends extends Document {
  userId: string,
  followers: string[];
  following: string[];
  blockedUser: string[];
}

const friendsSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    followers: {
      type: Array,
      required: true,
      default: [],
    },
    followings: {
      type: Array,
      required: true,
      default: [],
    },
    blockerUser: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const FriendsModel = mongoose.model<IFriends>("Friends", friendsSchema);

export default FriendsModel;
