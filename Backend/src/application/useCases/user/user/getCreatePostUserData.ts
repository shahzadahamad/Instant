import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetCreatePostUserData {
  private UserRepository: UserRepository;

  constructor(UserRepository: UserRepository) {
    this.UserRepository = UserRepository;
  }

  public async execute(search: any, userData: any): Promise<IUser[]> {
    const searchRegex = new RegExp(search, "i");
    const query = {
      $and: [
        {
          $or: [
            { username: { $regex: searchRegex } },
            { fullname: { $regex: searchRegex } },
          ],
        },
        { _id: { $nin: userData } },
      ],
    };

    const user = this.UserRepository.find10UserBySearch(query);
    return user;
  }
}
