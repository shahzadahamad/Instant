import OtpModel, {
  IOtp,
} from "../../infrastructure/database/models/otpVerificationModel";

export default class OtpRepository {
  public async createOtp(otp: string): Promise<IOtp> {
    try {
      const newOtp = new OtpModel({ otp });
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

  public async findByOptId(id: string) {
    try {
      const otp = await OtpModel.findOne({ _id: id });
      return await otp;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error verifying user: ${error.message}`);
        throw new Error("Failed to verify user");
      }
      console.error("Unknown error verifying user");
      throw new Error("Unknown error");
    }
  }

  public async removeOtp(id: string) {
    try {
      await OtpModel.deleteOne({ _id: id });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error remove otp: ${error.message}`);
        throw new Error("Failed to remove otp");
      }
      console.error("Unknown error removing otp");
      throw new Error("Unknown error");
    }
  }
}
