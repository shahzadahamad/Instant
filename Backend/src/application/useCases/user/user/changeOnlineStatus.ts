import UserRepository from "../../../repositories/user/userRepository";

export default class ChangeOnlineStatus {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(userId: string, status: boolean): Promise<void> {

    await this.userRepository.changeUserOnlineStatus(userId, status);

  }
}
