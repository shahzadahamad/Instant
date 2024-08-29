import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  otp: string;
  expiresAt: Date;
}

const otpSchema: Schema = new Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);

export default OtpModel;
