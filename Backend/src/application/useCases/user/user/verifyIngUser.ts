import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/userRepository";

export default class VerifyIngUser {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    return user;
  }
}
