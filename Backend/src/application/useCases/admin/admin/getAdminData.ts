import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IAdmin } from "../../../../infrastructure/database/models/adminModel";
import AdminRepository from "../../../repositories/admin/implements/adminRepository";

export default class GetAdminData {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  public async execute(adminId: string): Promise<Partial<IAdmin>> {

    const adminData = await this.adminRepository.findById(adminId);

    if (!adminData) {
      throw new Error(MESSAGES.ERROR.ADMIN_NOT_FOUND);
    }

    return adminData;
  }
}
