import mongoose, { Schema, Document } from "mongoose";

interface Reactions {
  fromId: string,
  reaction: string
}

interface Messages {
  type: string,
  message: string,
  reactions: Reactions[],
  senderId: string;
  deletedFrom: string[]
  seen: [{ userId: string, readAt: Date }]
}

export interface IMessage extends Document {
  _id: string;
  chatId: string;
  message: Messages[];
}

const messageSchema: Schema = new Schema(
  {
    chatId: {
      type: String,
      ref: "Chat",
      required: true
    },
    message: [{
      type: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      senderId: {
        type: String,
        required: true,
      },
      reactions: [{
        fromId: {
          type: String,
          required: true,
        },
        reaction: {
          type: String,
          required: true,
        }
      }],
      deletedFrom: [{
        type: String,
        ref: 'User',
        required: true
      }],
      seen: [{
        userId: {
          type: String,
          required: true
        },
        readAt: {
          type: Date,
          required: true,
        }
      }],
      createdAt: {
        type: Date,
        required: true,
      }
    }],
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model<IMessage>("Message", messageSchema);

export default MessageModel;
