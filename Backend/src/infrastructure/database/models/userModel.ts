import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  phoneNumber?: number;
  password: string;
  profilePicture?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  isPrivateAccount?: Boolean;
  isBlock?: Boolean;
  followers?: string[];
  following?: string[];
  blockedUser?: string[];
  role?: string;
}

const userSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
      default:
        "https://static.vecteezy.com/system/resources/previews/026/966/960/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
    },
    gender: {
      type: String,
      require: true,
      default: "",
    },
    dateOfBirth: {
      type: String,
      require: true,
      default: "",
    },
    bio: {
      type: String,
      require: true,
      default: "",
    },
    isPrivateAccount: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBlock: {
      type: Boolean,
      required: true,
      default: false,
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

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
