import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import ReportPost from "../../../../application/useCases/user/post/reportPost";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class ReportPostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const { reason } = req.query;
    const { userId } = req.user;

    const reportPost = new ReportPost(new PostRepository(), new UserRepository());

    try {
      const actionStatus = await reportPost.execute(userId, postId, reason as string);
      res.status(HttpStatusCode.OK).json({ message: actionStatus });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
