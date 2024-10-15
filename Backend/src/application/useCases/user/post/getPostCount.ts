import PostRepository from "../../../repositories/user/postRepository";

export default class GetPostCount {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async execute(id: string): Promise<number> {
    const postData = await this.postRepository.getUserPostCount(id);
    return postData;
  }
}
