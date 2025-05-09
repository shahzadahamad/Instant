import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class UserData {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(_id: string): Promise<IUser | void> {

    const user = await this.userRepository.findById1(_id);

    if (user) {
      return user;
    }

  }
}
