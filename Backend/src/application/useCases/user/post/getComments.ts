import { IComment } from "../../../../infrastructure/database/models/commentModel";
import CommentRepository from "../../../repositories/user/commentRepository";
import PostRepository from "../../../repositories/user/postRepository";

export default class GetComments {
  private postRepository: PostRepository;
  private commentRepository: CommentRepository;

  constructor(
    postRepository: PostRepository,
    commentRepository: CommentRepository
  ) {
    this.postRepository = postRepository;
    this.commentRepository = commentRepository;
  }

  public async execute(id: string): Promise<IComment[]> {
    const postData = await this.postRepository.findPostById(id);

    if (!postData) {
      throw new Error("Post not found!");
    }

    const newComment = await this.commentRepository.getComments(id);
    return newComment;
  }
}
