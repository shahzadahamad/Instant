import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import CommentRepository from "../../../../application/repositories/user/commentRepository";
import CommentPost from "../../../../application/useCases/user/post/commentPost";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import NotificationRepository from "../../../../application/repositories/user/notificationRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class CommentPostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const { userId } = req.user;
    const { comment } = req.body;

    const commentPost = new CommentPost(new PostRepository(), new UserRepository(), new CommentRepository(), new NotificationRepository());

    try {
      const data = await commentPost.execute(postId, userId, comment);
      res.status(HttpStatusCode.OK).json({ data: data });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
