import { IUser } from "../../../../infrastructure/database/models/userModel";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetUserDataAdmin {
  private userRepository: UserRepository;

  constructor(adminRepository: UserRepository) {
    this.userRepository = adminRepository;
  }

  public async execute(pageVal: string): Promise<any> {
    const page = parseInt(pageVal) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const user = await this.userRepository.getUserData(startIndex , limit);
    return user;
  }
}
