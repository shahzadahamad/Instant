import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import ArchivedPost from "../../../../application/useCases/user/post/archivedPosts";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class ArchivedPostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const archivedPosts = new ArchivedPost(new PostRepository());

    try {
      const data = await archivedPosts.execute(userId);
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
