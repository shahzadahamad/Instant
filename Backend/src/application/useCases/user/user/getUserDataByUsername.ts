import { IUser } from "../../../../infrastructure/database/models/userModel";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetUserDataByUsername {
  private userRepository: UserRepository;
  private postRepository: PostRepository;

  constructor(userRepository: UserRepository, postRepository: PostRepository) {
    this.userRepository = userRepository;
    this.postRepository = postRepository;
  }

  public async execute(
    username: string,
    userId: string
  ): Promise<{
    postCount: number;
    userWithoutSensitiveInfo: Partial<IUser> | null;
  }> {
    const user = await this.userRepository.findByUsername(username);
    const currentUser = await this.userRepository.findById(userId);

    if (!currentUser) {
      throw new Error("User not found.");
    }

    if (!user) {
      throw new Error("Invalid Access!");
    }

    if (currentUser._id.toString() === user._id.toString()) {
      return { postCount: 0, userWithoutSensitiveInfo: null };
    }
    const postCount = await this.postRepository.getUserPostCount(user._id);

    const { password, isBlock, ...userWithoutSensitiveInfo } = user.toObject();

    return { postCount, userWithoutSensitiveInfo };
  }
}
