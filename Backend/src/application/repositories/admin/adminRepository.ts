import AdminModel, {
  IAdmin,
} from "../../../infrastructure/database/models/adminModel";

export default class AdminRepository {
  public async findByUsernameAndEmail(
    usernameOrEmail: string
  ): Promise<IAdmin | null> {
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
}
