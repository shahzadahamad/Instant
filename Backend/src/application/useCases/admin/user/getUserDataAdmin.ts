import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetUserDataAdmin {
  private userRepository: UserRepository;

  constructor(adminRepository: UserRepository) {
    this.userRepository = adminRepository;
  }

  public async execute(pageVal: number, search: any): Promise<any> {
    const page = pageVal || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    let query = {};
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
      query
    );
    return user;
  }
}
