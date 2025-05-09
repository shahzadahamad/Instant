import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";

export default class GetPostCount {
  private postRepository: PostRepository;
  private friendsRepository: FriendsRepository;

  constructor(postRepository: PostRepository, friendsRepository: FriendsRepository) {
    this.postRepository = postRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(id: string): Promise<{ postCount: number, followings: number, followers: number }> {
    const postCount = await this.postRepository.getUserPostCount(id);
    const friendCounts = await this.friendsRepository.findUserDoc(id);
    return { postCount, followings: friendCounts ? friendCounts.followings.length : 0, followers: friendCounts ? friendCounts.followers.length : 0 };
  }
}
