import { MESSAGES } from "../../../../infrastructure/constants/messages";
import UserRepository from "../../../repositories/user/userRepository";

export default class BlockOrUnblockUserByAdmin {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(id: string, status: string): Promise<string> {
    if (status === "block") {
      await this.userRepository.blockAndUnBlockUser(id, true);
    } else if (status === "unblock") {
      await this.userRepository.blockAndUnBlockUser(id, false);
    } else {
      throw new Error(MESSAGES.ERROR.INVALID_ACTION);
    }
    return MESSAGES.SUCCESS.ACTION_SUCCESS;
  }
}
