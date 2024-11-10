import { IPost } from "../../../../infrastructure/database/models/postModel";
import LikeRepository from "../../../repositories/user/likeRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetLikedPostData {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private likeRepository: LikeRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository, likeRepository: LikeRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.likeRepository = likeRepository;
  }

  public async execute(id: string, username: string): Promise<IPost[]> {
    if (username) {
      const user = await this.userRepository.findByUsername(username);
      if (user) {
        const likedPosts = await this.likeRepository.findLikedPostUser(user._id);
        const likedPostData = await this.postRepository.findLikedPostData(likedPosts as string[]);
        return likedPostData;
      }
    }

    const likedPosts = await this.likeRepository.findLikedPostUser(id);
    const likedPostData = await this.postRepository.findLikedPostData(likedPosts as string[]);
    return likedPostData;
  }
}
