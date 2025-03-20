import { IPost } from "../../../../infrastructure/database/models/postModel";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class UserPostData {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository, friendsRepository: FriendsRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(id: string, username: string): Promise<IPost[]> {
    if (username) {
      const user = await this.userRepository.findByUsername(username);
      if (user) {
        const isFriend = await this.friendsRepository.isAlreadyFollowing(id, user._id.toString());

        if (user.isPrivateAccount && !isFriend) {
          return [];
        }
        const postData = await this.postRepository.findUserPostData(user._id);
        return postData;
      }
    }

    const postData = await this.postRepository.findUserPostData(id);
    return postData;
  }
}
