import { IAdmin } from "../../../../infrastructure/database/models/adminModel";
import AdminRepository from "../../../repositories/admin/adminRepository";

export default class GetAdminData {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository;
  }

  public async execute(adminId: string): Promise<Partial<IAdmin>> {

    const adminData = await this.adminRepository.findById(adminId);

    if (!adminData) {
      throw new Error("Admin not found!");
    }

    return adminData;
  }
}
