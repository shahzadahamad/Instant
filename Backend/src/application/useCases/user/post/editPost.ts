import { IPost } from "../../../../infrastructure/database/models/postModel";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class EditPost {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public async execute(
    userId: string,
    postId: string,
    caption: string,
    hideLikesAndViewCount: boolean,
    turnOffCounting: boolean
  ): Promise<string> {
    const postData = await this.postRepository.findPostById(postId);
    const userData = await this.userRepository.findById(userId);

    if (!postData) {
      throw new Error("Post not found!");
    }

    if (!userData) {
      throw new Error("User now found!");
    }

    if (userData._id.toString() !== postData.userId.toString()) {
      throw new Error("Invalid Action!");
    }

    await this.postRepository.updatePost(
      postId,
      caption,
      hideLikesAndViewCount,
      turnOffCounting
    );
    return "Post Updated Successfully.";
  }
}
