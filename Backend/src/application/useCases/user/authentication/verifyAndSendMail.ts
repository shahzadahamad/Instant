import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { EmailOptionsResetPassword } from "../../../interface/emailInterface";
import { EmailService } from "../../../providers/nodeMailer";
import TokenManager from "../../../providers/tokenManager";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class VerifyAndSendMail {
  private userRepository: UserRepository;
  private tokenManager: TokenManager;
  private emailService: EmailService;

  constructor(userRepository: UserRepository, tokenManager: TokenManager, emailService: EmailService) {
    this.userRepository = userRepository;
    this.tokenManager = tokenManager;
    this.emailService = emailService;
  }

  public async execute(emailOrUsername: string): Promise<string> {
    const user = await this.userRepository.findByUsernameAndEmail(emailOrUsername);

    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const token = await this.tokenManager.generatePasswordResetToken(user._id, user.password);

    const emailOptions: EmailOptionsResetPassword = { to: user.email, fullname: user.fullname, userId: user._id, token };

    await this.emailService.sendEmailResetPassword(emailOptions);

    return MESSAGES.SUCCESS.RESET_LINK_SEND;
  }
}
