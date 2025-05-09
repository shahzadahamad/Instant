import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class GetUserData {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<Partial<IUser>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_ACCESS);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, isBlock, ...userWithoutSensitiveInfo } = user.toObject();

    return userWithoutSensitiveInfo;
  }
}
