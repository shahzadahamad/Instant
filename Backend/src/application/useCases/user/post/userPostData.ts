import { IPost } from "../../../../infrastructure/database/models/postModel";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class UserPostData {
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
        const postData = await this.postRepository.findUserPostData(user._id);
        return postData;
      }
    }

    const postData = await this.postRepository.findUserPostData(id);
    return postData;
  }
}
