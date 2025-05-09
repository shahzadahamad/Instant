import { IPost } from "../../../../infrastructure/database/models/postModel";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class Reels {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public async execute(id: string, username: string): Promise<IPost[]> {


    if (username) {
      const user = await this.userRepository.findByUsername(username);
      if (user) {
        const reelData = await this.postRepository.findUserReelsPost(user._id);
        return reelData;
      }
    }

    const reelData = await this.postRepository.findUserReelsPost(id);
    return reelData;
  }
}
