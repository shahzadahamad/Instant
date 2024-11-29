import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  fromId: string,
  relatedId: string
  type: string;
  message: string;
  read: boolean;
}

const notificationSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    fromId: {
      type: String,
      ref: "User",
    },
    postId: {
      type: String,
      ref: 'Post',
    },
    commentId: {
      type: String,
      ref: "Comment"
    },
    relation: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema);

export default NotificationModel;
