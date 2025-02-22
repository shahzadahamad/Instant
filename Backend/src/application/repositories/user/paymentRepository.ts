import PaymentModel, { IPayment } from "../../../infrastructure/database/models/paymentModal";

export default class PaymentRepository {
  public async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
    try {
      const newOtp = new PaymentModel(paymentData);
      return await newOtp.save();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating otp: ${error.message}`);
        throw new Error("Failed to create otp");
      }
      console.error("Unknown error creating otp");
      throw new Error("Unknown error");
    }
  }
}
