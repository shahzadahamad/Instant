import { IComment } from "../../../../infrastructure/database/models/commentModel";
import CommentRepository from "../../../repositories/user/commentRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class ReplyComment {
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
    commentId: string,
    comment: string
  ){
    const commentData = await this.commentRepository.findCommentById(commentId);
    const postData = await this.postRepository.findPostById(id);
    const userData = await this.userRepository.findById(userId);

    if (!commentData) {
      throw new Error("Comment not found!");
    }

    if (!userData) {
      throw new Error("User not found!");
    }

    if (!postData) {
      throw new Error("Post not found!");
    }


    const replyComment = await this.commentRepository.replytoComment(
      id,
      userId,
      commentId,
      comment,
      userData.username,
      userData.profilePicture
    );
    return replyComment;
  }
}
