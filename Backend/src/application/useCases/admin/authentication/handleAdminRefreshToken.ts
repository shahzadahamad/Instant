import TokenManager from "../../../providers/tokenManager";
import AdminRepository from "../../../repositories/admin/adminRepository";

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
      throw new Error("No refresh token");
    }

    console.log('inin 1')

    try {
      const decoded = (await this.tokenManager.verifyRefreshToken(
        adminRefreshToken
      )) as { userId: string };
      const admin = await this.adminRepository.findById(decoded.userId);

      console.log('inin2')

      if (!admin) {
        throw new Error("admin not found");
      }

      console.log('inin3')

      const newAdminAccessToken = await this.tokenManager.generateAccessToken({
        userId: admin._id,
        role: "admin",
      });

      console.log('new token' + "incresase")
      return { adminToken: newAdminAccessToken };
    } catch (error) {
      return { clearCookie: true };
    }
  }
}
