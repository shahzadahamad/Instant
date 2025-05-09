import { MESSAGES } from "../../../../infrastructure/constants/messages";
import PasswordHasher from "../../../providers/passwordHasher";
import AdminRepository from "../../../repositories/admin/adminRepository";

export default class EditAdminPassword {
  private adminRepository: AdminRepository;
  private passwordHasher: PasswordHasher;

  constructor(adminRepository: AdminRepository, passwordHasher: PasswordHasher) {
    this.adminRepository = adminRepository;
    this.passwordHasher = passwordHasher;
  }

  public async execute(adminId: string, currentPassword: string, newPassword: string): Promise<string> {

    const adminData = await this.adminRepository.findByIdWithPassword(adminId);

    if (!adminData) {
      throw new Error(MESSAGES.ERROR.ADMIN_NOT_FOUND);
    }

    const passwordCheck = await this.passwordHasher.compare(currentPassword, adminData.password);

    if (!passwordCheck) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const hashedPassword = await this.passwordHasher.hash(newPassword);

    await this.adminRepository.changePassword(adminId, hashedPassword);

    return MESSAGES.SUCCESS.PASSWORD_UPDATED
  }
}
