import { IPostWithUserData } from "../../../interface/post";
import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class GetTaggedPostData {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository, friendsRepository: FriendsRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(id: string, username: string): Promise<IPostWithUserData[]> {
    const followings = await this.friendsRepository.findUserDoc(id);
    const userFollowings = followings?.followings ?? [];
    if (username) {
      const user = await this.userRepository.findByUsername(username);
      if (user) {
        const postData = await this.postRepository.findUserTaggedPosts(user._id);
        return postData.filter((post) => {
          return !post.userId.isPrivateAccount || [...userFollowings, id].includes(post.userId._id.toString());
        });
      }
    }

    const postData = await this.postRepository.findUserTaggedPosts(id);
    return postData.filter((post) => {
      return !post.userId.isPrivateAccount || [...userFollowings, id].includes(post.userId._id.toString());
    });
  }
}
