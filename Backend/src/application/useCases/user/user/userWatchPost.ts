import PostRepository from "../../../repositories/user/postRepository";
import UserMoreDataRepository from "../../../repositories/user/userMoreDataRepository";

export default class UserWatchPost {
  private postRepository: PostRepository;
  private userMoreDataRepository: UserMoreDataRepository;

  constructor(postRepository: PostRepository, userMoreDataRepository: UserMoreDataRepository) {
    this.postRepository = postRepository;
    this.userMoreDataRepository = userMoreDataRepository;
  }

  public async execute(userId: string, postId: string) {

    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error('Post not found!');
    }

    await this.userMoreDataRepository.watchedPostAdd(userId, postId);
    return true;

  }
}
