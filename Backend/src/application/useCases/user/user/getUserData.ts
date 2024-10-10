import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetUserData {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<Partial<IUser>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Invalid Access!");
    }

    const { password, isBlock, ...userWithoutSensitiveInfo } = user.toObject();

    return userWithoutSensitiveInfo;
  }
}
