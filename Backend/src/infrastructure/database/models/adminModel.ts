import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
}

const adminSchema: Schema = new Schema(
  {
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
  },
);

const AdminModel = mongoose.model<IAdmin>("Admin", adminSchema);

export default AdminModel;
