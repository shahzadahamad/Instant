import { IComment } from "../../../../infrastructure/database/models/commentModel";
import CommentRepository from "../../../repositories/user/commentRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class CommentPost {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private commentRepository: CommentRepository;

  constructor(
    postRepository: PostRepository,
    userRepository: UserRepository,
    commentRepository: CommentRepository
  ) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
  }

  public async execute(
    id: string,
    userId: string,
    comment: string
  ): Promise<IComment> {
    const postData = await this.postRepository.findPostById(id);
    const userData = await this.userRepository.findById(userId);

    if (!userData) {
      throw new Error("User now found!");
    }

    if (!postData) {
      throw new Error("Post not found!");
    }

    const newComment = await this.commentRepository.createPost(
      id,
      userId,
      comment
    );
    return newComment;
  }
}
