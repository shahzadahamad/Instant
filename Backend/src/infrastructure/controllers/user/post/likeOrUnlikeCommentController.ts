import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import LikeRepository from "../../../../application/repositories/user/implements/likeRepository";
import CommentRepository from "../../../../application/repositories/user/implements/commentRepository";
import LikeOrUnlikeComment from "../../../../application/useCases/user/post/likeOrUnlikeComment";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import NotificationRepository from "../../../../application/repositories/user/implements/notificationRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class LikeOrUnlikeCommentController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId, commentId, status } = req.params;
    const { userId } = req.user;
    const likeOrUnlikeComment = new LikeOrUnlikeComment(new PostRepository(), new LikeRepository(), new CommentRepository(), new NotificationRepository());

    try {
      const actionStatus = await likeOrUnlikeComment.execute(postId, commentId, userId, status);
      res.status(HttpStatusCode.OK).json(actionStatus);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
