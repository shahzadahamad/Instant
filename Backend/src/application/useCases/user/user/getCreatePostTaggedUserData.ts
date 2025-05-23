import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class GetCreatePostTaggedUserData {
  private UserRepository: UserRepository;

  constructor(UserRepository: UserRepository) {
    this.UserRepository = UserRepository;
  }

  public async execute(taggedUsers: string[]): Promise<IUser[]> {
    const user = this.UserRepository.findUsers(taggedUsers);
    return user;
  }
}
