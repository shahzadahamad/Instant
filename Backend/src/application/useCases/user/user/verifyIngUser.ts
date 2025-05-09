import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class VerifyIngUser {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    if (user) {

      if (user.isVerified.expireAt) {
        const expireAt = new Date(user.isVerified.expireAt);
        const now = new Date();

        if (expireAt < now) {
          await this.userRepository.setVerificationStatusFalse(user._id);
        }
      }

      return user;
    }
    return null;
  }
}
