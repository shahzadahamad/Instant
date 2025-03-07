import { IUser } from "../../../../infrastructure/database/models/userModel";
import { QueryTypeGetUserDataAdin } from "../../../interface/post";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetUserDataAdmin {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(pageVal: number, search: string, limit: number): Promise<{ users: IUser[]; totalPages: number; totalUser: number }> {
    const page = pageVal || 1;
    const startIndex = (page - 1) * limit;
    let query: QueryTypeGetUserDataAdin = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { fullname: { $regex: searchRegex } },
          { username: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phoneNumber: { $regex: searchRegex } },
        ],
      };
    }
    const user = await this.userRepository.getUserData(
      startIndex,
      limit,
      query,
    );
    return user;
  }
}
