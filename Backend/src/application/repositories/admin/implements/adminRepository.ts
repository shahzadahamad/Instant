import AdminModel, {
  IAdmin,
} from "../../../../infrastructure/database/models/adminModel";
import { IAdminRepository } from "../interfaces/IAdminRepository";

export default class AdminRepository implements IAdminRepository {
  public async findByUsernameAndEmail(usernameOrEmail: string): Promise<IAdmin | null> {
    try {
      return await AdminModel.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find user");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async findById(_id: string): Promise<IAdmin | null> {
    try {
      return await AdminModel.findOne({ _id: _id }, { password: 0 });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async findByIdWithPassword(_id: string): Promise<IAdmin | null> {
    try {
      return await AdminModel.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async changePassword(_id: string, password: string): Promise<void> {
    try {
      await AdminModel.updateOne({ _id: _id }, { $set: { password } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async updateAdmin(adminId: string, username: string, email: string, fileUrl?: string): Promise<IAdmin | null> {
    try {
      return await AdminModel.findByIdAndUpdate(
        { _id: adminId },
        {
          $set: {
            username,
            email,
            profilePicture: fileUrl,
          },
        },
        {
          new: true,
          select: '-password',
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error update user: ${error.message}`);
        throw new Error("Failed to update user");
      }
      console.error("Unknown error update user");
      throw new Error("Unknown error");
    }
  }
}
