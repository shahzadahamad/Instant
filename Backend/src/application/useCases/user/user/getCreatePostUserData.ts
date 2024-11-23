import { IUser } from "../../../../infrastructure/database/models/userModel";
import { QueryType } from "../../../interface/post";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetCreatePostUserData {
  private UserRepository: UserRepository;

  constructor(UserRepository: UserRepository) {
    this.UserRepository = UserRepository;
  }

  public async execute(search: string, userData: string[]): Promise<IUser[]> {
    const searchRegex = new RegExp(search, "i");
    const query: QueryType = {
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
