import { IPostWithUserData } from "../../../interface/post";
import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import LikeRepository from "../../../repositories/user/implements/likeRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class GetLikedPostData {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private likeRepository: LikeRepository;
  private friendsRepository: FriendsRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository, likeRepository: LikeRepository, friendsRepository: FriendsRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.likeRepository = likeRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(id: string, username: string): Promise<IPostWithUserData[]> {
    const followings = await this.friendsRepository.findUserDoc(id);
    const userFollowings = followings?.followings ?? [];
    if (username) {
      const user = await this.userRepository.findByUsername(username);
      if (user) {
        const likedPosts = await this.likeRepository.findLikedPostUser(user._id);
        let likedPostData = await this.postRepository.findLikedPostData(likedPosts as string[]);
        likedPostData = likedPostData.filter((post) => {
          return !post.userId.isPrivateAccount || [...userFollowings, id].includes(post.userId._id.toString());
        });
        return likedPostData;
      }
    }

    const likedPosts = await this.likeRepository.findLikedPostUser(id);
    const likedPostData = await this.postRepository.findLikedPostData(likedPosts as string[]);
    return likedPostData.filter((post) => {
      return !post.userId.isPrivateAccount || [...userFollowings, id].includes(post.userId._id.toString());
    });
  }
}
