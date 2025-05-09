import { IOtp } from "../../../../infrastructure/database/models/otpVerificationModel";

export interface IOptRepository {
  createOtp(otp: string): Promise<IOtp>;
  findByOptId(id: string[]): Promise<IOtp[]>
  removeOtp(id: string[]): void;
}