import { MESSAGES } from "../../../../infrastructure/constants/messages";
import PasswordHasher from "../../../providers/passwordHasher";
import TokenManager from "../../../providers/tokenManager";
import AdminRepository from "../../../repositories/admin/implements/adminRepository";

export default class AuthenticateAdmin {
  private adminRepository: AdminRepository;
  private passwordHasher: PasswordHasher;
  private tokenManager: TokenManager;

  constructor(adminRepository: AdminRepository, passwordHasher: PasswordHasher, tokenManager: TokenManager) {
    this.adminRepository = adminRepository;
    this.passwordHasher = passwordHasher;
    this.tokenManager = tokenManager;
  }
  public async execute(usernameOrEmail: string, password: string): Promise<{ token: string; refreshToken: string; admin: { _id: string, username: string, email: string, profilePicture: string } }> {
    const adminExist = await this.adminRepository.findByUsernameAndEmail(usernameOrEmail);
    if (!adminExist) {
      throw new Error(MESSAGES.ERROR.ADMIN_NOT_FOUND);
    }

    const isValidPassword = await this.passwordHasher.compare(password, adminExist.password);
    if (!isValidPassword) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const token = await this.tokenManager.generateAccessToken({ userId: adminExist._id, role: "admin", });
    const refreshToken = await this.tokenManager.generateRefreshToken(adminExist._id);
    const { _id, username, email, profilePicture } = adminExist;

    return { token, refreshToken, admin: { _id, username, email, profilePicture, }, };
  }
}
