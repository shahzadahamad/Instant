import { UpdateWriteOpResult } from "mongoose";
import UserModel, {
  IUser,
} from "../../../infrastructure/database/models/userModel";
import { QueryType, QueryTypeGetUserDataAdin } from "../../interface/post";

export default class UserRepository {
  public async findById(_id: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

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

  public async findByUsernameEdit(
    username: string,
    userId: string
  ): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ username, _id: { $ne: userId } });
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

  public async userPasswordChange(
    userId: string,
    password: string
  ): Promise<UpdateWriteOpResult> {
    try {
      return await UserModel.updateOne(
        { _id: userId },
        { $set: { password: password } }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error updating password user: ${error.message}`);
        throw new Error("Failed to update password user");
      }
      console.error("Unknown error updating password user");
      throw new Error("Unknown error");
    }
  }

  public async updateUser(
    userId: string,
    fullname: string,
    username: string,
    email: string,
    phoneNumber: string,
    gender: string,
    dateOfBirth: string,
    isPrivateAccount: boolean,
    bio: string,
    fileUrl?: string
  ): Promise<IUser | null> {
    try {
      return await UserModel.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            fullname,
            username,
            email,
            phoneNumber,
            gender,
            dateOfBirth,
            isPrivateAccount,
            profilePicture: fileUrl,
            bio: bio.trim(),
          },
        },
        {
          new: true,
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

  public async getUserData(
    startIndex: number,
    limit: number,
    query: QueryTypeGetUserDataAdin
  ): Promise<{ users: IUser[]; totalPages: number; totalUser: number }> {
    try {
      const totalUser = await UserModel.countDocuments();
      const searchTotalUser = await UserModel.countDocuments(query);
      const users = await UserModel.find(query, { password: 0 })
        .skip(startIndex)
        .limit(limit);
      return {
        users,
        totalPages: Math.ceil(searchTotalUser / limit),
        totalUser,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find user");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async blockAndUnBlockUser(_id: string, status: boolean) {
    try {
      await UserModel.updateOne({ _id: _id }, { $set: { isBlock: status } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async find10UserBySearch(query: QueryType): Promise<IUser[]> {
    try {
      const userData = await UserModel.find(query, {
        _id: 1,
        username: 1,
        fullname: 1,
        profilePicture: 1,
      }).limit(10);
      return userData;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find user");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }
  public async findTaggedUser(data: string[]): Promise<IUser[]> {
    try {
      const musicData = await UserModel.find(
        { _id: { $in: data } },
        {
          _id: 1,
          username: 1,
          fullname: 1,
          profilePicture: 1,
        }
      );
      return musicData;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find user");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async findUserDataWithIdInArray(data: string[]): Promise<IUser[]> {
    try {
      return await UserModel.find(
        { _id: { $in: data } },
        {
          _id: 1,
          username: 1,
          fullname: 1,
          profilePicture: 1,
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find user");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async changeUserOnlineStatus(userId: string, isOnline: boolean): Promise<UpdateWriteOpResult> {
    try {
      return await UserModel.updateOne({ _id: userId }, { $set: { isOnline: { status: isOnline, date: new Date() } } });
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

