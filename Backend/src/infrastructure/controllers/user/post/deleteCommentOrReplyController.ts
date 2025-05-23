import { Request, Response } from "express";
import LikeRepository from "../../../../application/repositories/user/implements/likeRepository";
import CommentRepository from "../../../../application/repositories/user/implements/commentRepository";
import DeleteCommentOrReply from "../../../../application/useCases/user/post/deleteCommentOrReply";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import NotificationRepository from "../../../../application/repositories/user/implements/notificationRepository";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class DeleteCommentOrReplyController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { commentOrReplyId, actionFor } = req.params;
    const { userId } = req.user;

    const deleteCommentOrReply = new DeleteCommentOrReply(new LikeRepository(), new CommentRepository(), new NotificationRepository(), new PostRepository());

    try {
      const data = await deleteCommentOrReply.execute(commentOrReplyId, actionFor, userId);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
