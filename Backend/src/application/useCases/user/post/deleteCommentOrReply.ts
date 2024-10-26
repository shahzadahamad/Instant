import { IComment } from "../../../../infrastructure/database/models/commentModel";
import CommentRepository from "../../../repositories/user/commentRepository";
import LikeRepository from "../../../repositories/user/likeRepository";


export default class DeleteCommentOrReply {
  private likeRepository: LikeRepository;
  private commentRepository: CommentRepository;

  constructor(
    likeRepository: LikeRepository,
    commentRepository: CommentRepository
  ) {
    this.likeRepository = likeRepository;
    this.commentRepository = commentRepository;
  }

  public async execute(commentOrReplyId: string, actionFor: string, userId: string): Promise<{ commentId: string, message: string }> {

    const commentOrReplyExist = await this.commentRepository.findcommentOrReplyIdById(commentOrReplyId);

    if (!commentOrReplyExist) {
      throw new Error("Comment not found!")
    }


    if (userId !== commentOrReplyExist.userId.toString()) {
      throw new Error("Invalid Action!");
    }

    if ('reply' in commentOrReplyExist) {
      commentOrReplyExist.reply.forEach(async (item) => {
        await this.likeRepository.deleteCommentlikes(item._id);
      })
    }
    await this.likeRepository.deleteCommentlikes(commentOrReplyExist._id);
    await this.commentRepository.deleteComment(commentOrReplyExist._id);

    return { commentId: commentOrReplyExist._id, message: "Comment deleted." };
  }
}
