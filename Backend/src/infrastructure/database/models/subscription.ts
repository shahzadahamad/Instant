import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  _id: string;
  period: string;
  price: number;
  offer: number;
  isListed: boolean;
}

const subscriptionSchema: Schema = new Schema(
  {
    period: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offer: {
      type: Number,
      required: true,
    },
    isListed: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubscriptionModel = mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export default SubscriptionModel;
