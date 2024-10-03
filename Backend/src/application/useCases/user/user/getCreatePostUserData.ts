import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetCreatePostUserData {
  private UserRepository: UserRepository;

  constructor(UserRepository: UserRepository) {
    this.UserRepository = UserRepository;
  }

  public async execute(search: any): Promise<IUser[]> {
    const searchRegex = new RegExp(search, "i");
    const query = {
      $or: [
        { username: { $regex: searchRegex } },
        { fullname: { $regex: searchRegex } },
      ],
    };

    const user = this.UserRepository.find10UserBySearch(query);
    return user;
  }
}
