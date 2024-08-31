import PasswordHasher from "../../../providers/passwordHasher";
import TokenManager from "../../../providers/tokenManager";
import UserRepository from "../../../repositories/user/userRepository";

export default class ResetPassword {
  private userRepository: UserRepository;
  private tokenManager: TokenManager;
  private passwordHasher: PasswordHasher;

  constructor(
    userRepository: UserRepository,
    tokenManager: TokenManager,
    passwordHasher: PasswordHasher
  ) {
    this.userRepository = userRepository;
    this.tokenManager = tokenManager;
    this.passwordHasher = passwordHasher;
  }

  public async execute(
    userId: string,
    token: string,
    password: string
  ): Promise<string> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Invalid Access!");
    }

    try {
      await this.tokenManager.verifyPasswordResetToken(token,user.password);
    } catch (error) {
      throw new Error("Invalid Access!");
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    await this.userRepository.userPasswordChange(userId, hashedPassword);

    return "Password reset successful";
  }
}
