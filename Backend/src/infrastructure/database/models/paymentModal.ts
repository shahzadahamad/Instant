import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  _id: string;
  userId: string;
  transactionId: string,
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'falied', 'pending']
    }
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);

export default PaymentModel;
