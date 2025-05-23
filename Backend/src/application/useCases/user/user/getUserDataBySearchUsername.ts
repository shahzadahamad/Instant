import { IUser } from "../../../../infrastructure/database/models/userModel";
import { QueryType } from "../../../interface/post";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class GetUserDataBySearchUsername {
  private UserRepository: UserRepository;

  constructor(UserRepository: UserRepository) {
    this.UserRepository = UserRepository;
  }

  public async execute(search: string): Promise<IUser[]> {
    const searchRegex = new RegExp(search, "i");
    const query: QueryType = {
      $and: [
        {
          $or: [
            { username: { $regex: searchRegex } },
            { fullname: { $regex: searchRegex } },
          ],
        },
      ],
    };

    const user = this.UserRepository.find10UserBySearch(query);
    return user;
  }
}
