import { IPost } from "../../../../infrastructure/database/models/postModel";
import PostRepository from "../../../repositories/user/postRepository";

export default class Reels {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async execute(id: string): Promise<IPost[]> {
    const reelData = await this.postRepository.findUserReelsPost(id);
    return reelData;
  }
}
