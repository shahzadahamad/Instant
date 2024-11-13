import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  userId: string,
  friendRequest: string[];
  messageRequest: string[];
}

const requestSchema: Schema = new Schema(
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
    messageRequest: {
      type: [String],
      required: true,
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const RequestModel = mongoose.model<IRequest>("Request", requestSchema);

export default RequestModel;
