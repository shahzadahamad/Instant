import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  _id: string;
  type: string;
  name: string,
  profilePicture: string;
  admins: string[],
  members: string[];
  readBy: string[];
  lastMessage: string;
}

const chatSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true
    },
    profilePicture: {
      type: String,
    },
    admins: {
      type: [{
        type: String,
      }]
    },
    createdBy: {
      type: String,
      ref: 'User',
    },
    members: {
      type: [{
        type: String,
        ref: 'User'
      }],
      required: true,
    },
    type: {
      type: String,
      enum: ['personal', 'group'],
      required: true
    },
    readBy: {
      userId: {
        type: String,
        required: true
      },
    },
    lastMessage: {
      fromId: {
        type: String,
        ref: "User"
      },
      message: {
        type: String,
      }
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);

export default ChatModel;
