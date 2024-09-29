import UserRepository from "../../../repositories/user/userRepository";

export default class BlockOrUnblockUserByAdmin {
  private userRepository: UserRepository;

  constructor(adminRepository: UserRepository) {
    this.userRepository = adminRepository;
  }

  public async execute(id: string, status: string): Promise<any> {
    if (status === "block") {
      await this.userRepository.blockUser(id)
    } else if (status === "unblock") {
      await this.userRepository.unBlockUser(id)
    } else {
      throw new Error("Invalid action");
    }
    return "action successfull"
  }
}
