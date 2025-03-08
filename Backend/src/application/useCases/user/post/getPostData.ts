import { IPost } from "../../../../infrastructure/database/models/postModel";
import { IpostWithUserData } from "../../../interface/post";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetPostData {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string, postId: string): Promise<IpostWithUserData | null> {
    const postData = await this.postRepository.findPostById(postId);
    const userData = await this.userRepository.findById(userId);

    if (!postData) {
      throw new Error("Post not found!");
    }

    if (!userData) {
      throw new Error("User now found!");
    }

    if (userData?._id.toString() !== postData?.userId.toString()) {
      throw new Error("Invalid Action!");
    }

    const data = await this.postRepository.findPostByIdWithUserData(postId);
    return data;
  }
}
