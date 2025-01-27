import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  _id: string;
  type: string;
  members: string[];
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
    lastMessage: {
      fromId: {
        type: String,
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
