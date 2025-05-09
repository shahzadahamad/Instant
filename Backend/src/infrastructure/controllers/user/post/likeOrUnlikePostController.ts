import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import LikeRepository from "../../../../application/repositories/user/implements/likeRepository";
import LikeOrUnlikePost from "../../../../application/useCases/user/post/likeOrUnlikePost";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import NotificationRepository from "../../../../application/repositories/user/implements/notificationRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class LikeOrUnlikePostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId, status } = req.params;
    const { userId } = req.user;
    const likeOrUnlikePost = new LikeOrUnlikePost(new PostRepository(), new LikeRepository(), new NotificationRepository());

    try {
      const actionStatus = await likeOrUnlikePost.execute(postId, userId, status);
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
