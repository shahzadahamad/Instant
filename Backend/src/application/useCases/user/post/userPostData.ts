import { IPost } from "../../../../infrastructure/database/models/postModel";
import PostRepository from "../../../repositories/user/postRepository";

export default class UserPostData {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async execute(id: string): Promise<IPost[]> {
    const postData = await this.postRepository.findUserPostData(id);
    return postData;
  }
}
