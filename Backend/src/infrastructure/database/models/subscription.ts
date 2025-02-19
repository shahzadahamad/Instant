import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  userId: string,
  period: string;
  price: number;
  offer: string;
}

const subscriptionSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offer: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const SubscriptionModel = mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export default SubscriptionModel;
