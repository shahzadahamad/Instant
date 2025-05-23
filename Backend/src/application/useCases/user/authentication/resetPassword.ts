import { MESSAGES } from "../../../../infrastructure/constants/messages";
import PasswordHasher from "../../../providers/passwordHasher";
import TokenManager from "../../../providers/tokenManager";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class ResetPassword {
  private userRepository: UserRepository;
  private tokenManager: TokenManager;
  private passwordHasher: PasswordHasher;

  constructor(userRepository: UserRepository, tokenManager: TokenManager, passwordHasher: PasswordHasher) {
    this.userRepository = userRepository;
    this.tokenManager = tokenManager;
    this.passwordHasher = passwordHasher;
  }

  public async execute(userId: string, token: string, password: string): Promise<string> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_ACCESS);
    }

    try {
      await this.tokenManager.verifyPasswordResetToken(token, user.password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error(MESSAGES.ERROR.INVALID_ACCESS);
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    await this.userRepository.userPasswordChange(userId, hashedPassword);

    return MESSAGES.SUCCESS.PASSWORD_RESET;
  }
}
