import UserModel, {
  IUser,
} from "../../../infrastructure/database/models/userModel";

export default class UserRepository {
  public async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find user");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async findByUsernameAndEmail(
    usernameOrEmail: string
  ): Promise<IUser | null> {
    try {
      return await UserModel.findOne({
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

  public async findByUsername(username: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ username });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find user");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async createUser(user: Partial<IUser>): Promise<IUser | null> {
    try {
      const newUser = await new UserModel(user);
      return await newUser.save();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating user: ${error.message}`);
        throw new Error("Failed to create user");
      }
      console.error("Unknown error creating user");
      throw new Error("Unknown error");
    }
  }
}
