import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  message: string;
  read: boolean;
}

const notificationSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
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
