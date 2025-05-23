import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import UserMoreDataRepository from "../../../../application/repositories/user/implements/userMoreDataRepository";
import UserWatchPost from "../../../../application/useCases/user/user/userWatchPost";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class UserWatchPostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { postId } = req.params;

    const userWatchPost = new UserWatchPost(new PostRepository(), new UserMoreDataRepository());

    try {
      const data = await userWatchPost.execute(userId, postId);
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
