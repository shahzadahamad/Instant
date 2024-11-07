import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import LikeRepository from "../../../../application/repositories/user/likeRepository";
import CommentRepository from "../../../../application/repositories/user/commentRepository";
import LikeOrUnlikeComment from "../../../../application/useCases/user/post/likeOrUnlikeComment";

export default class LikeOrUnlikeCommentController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId, commentId, status } = req.params;
    const { userId } = req.user;
    const likeOrUnlikeComment = new LikeOrUnlikeComment(
      new PostRepository(),
      new LikeRepository(),
      new CommentRepository()
    );

    try {
      const actionStatus = await likeOrUnlikeComment.execute(
        postId,
        commentId,
        userId,
        status
      );
      res.status(200).json(actionStatus);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
