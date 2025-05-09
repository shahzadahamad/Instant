import { MESSAGES } from "../../../../infrastructure/constants/messages";
import TokenManager from "../../../providers/tokenManager";
import AdminRepository from "../../../repositories/admin/implements/adminRepository";

export default class HandleAdminRefreshToken {
  private adminRepository: AdminRepository;
  private tokenManager: TokenManager;

  constructor(userRepository: AdminRepository, tokenManager: TokenManager) {
    this.adminRepository = userRepository;
    this.tokenManager = tokenManager;
  }
  public async execute(
    adminRefreshToken: string
  ): Promise<{ adminToken?: string; clearCookie?: boolean }> {
    if (!adminRefreshToken) {
      throw new Error(MESSAGES.ERROR.NO_REFRESH_TOKEN);
    }
    try {
      const decoded = (await this.tokenManager.verifyRefreshToken(
        adminRefreshToken
      )) as { userId: string };
      const admin = await this.adminRepository.findById(decoded.userId);
      if (!admin) {
        throw new Error(MESSAGES.ERROR.ADMIN_NOT_FOUND);
      }
      const newAdminAccessToken = await this.tokenManager.generateAccessToken({ userId: admin._id, role: "admin", });

      return { adminToken: newAdminAccessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { clearCookie: true };
    }
  }
}
