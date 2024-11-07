import { Request, Response } from "express";
import LikeRepository from "../../../../application/repositories/user/likeRepository";
import CommentRepository from "../../../../application/repositories/user/commentRepository";
import DeleteCommentOrReply from "../../../../application/useCases/user/post/deleteCommentOrReply";

export default class DeleteCommentOrReplyController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { commentOrReplyId, actionFor } = req.params;
    const { userId } = req.user;

    const deleteCommentOrReply = new DeleteCommentOrReply(
      new LikeRepository(),
      new CommentRepository()
    );

    try {
      const data = await deleteCommentOrReply.execute(commentOrReplyId, actionFor, userId);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
