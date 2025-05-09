import { IPost } from "../../../../infrastructure/database/models/postModel";
import PostRepository from "../../../repositories/user/implements/postRepository";

export default class ArchivedPost {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async execute(id: string): Promise<IPost[]> {
    const postData = await this.postRepository.findUserArchivedPost(id);
    return postData;
  }
}
