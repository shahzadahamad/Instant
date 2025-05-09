import UserRepository from "../../../repositories/user/userRepository";

export default class CheckUserByUsername {
  private UserRepository: UserRepository;

  constructor(UserRepository: UserRepository) {
    this.UserRepository = UserRepository;
  }

  public async execute(userId: string): Promise<{ username: string; userId: string } | boolean> {
    const user = await this.UserRepository.findByUsername(userId);

    if (!user) {
      return false;
    }

    return { userId: user._id, username: user.username };
  }
}
