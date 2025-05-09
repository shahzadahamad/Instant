import { IAdmin } from "../../../../infrastructure/database/models/adminModel";

export interface IAdminRepository {
  findByUsernameAndEmail(usernameOrEmail: string): Promise<IAdmin | null>
  findById(_id: string): Promise<IAdmin | null>;
  findByIdWithPassword(_id: string): Promise<IAdmin | null>;
  changePassword(_id: string, password: string): Promise<void>;
  updateAdmin(adminId: string, username: string, email: string, fileUrl?: string): Promise<IAdmin | null>;
}