import { IPayment } from "../../../../infrastructure/database/models/paymentModal";

export interface IPaymentRepository {
  createPayment(paymentData: Partial<IPayment>): Promise<IPayment>;
  getAllPayments(): Promise<IPayment[]>;
}