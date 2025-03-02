import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import Archive from "../../../../application/useCases/user/post/archive";

export default class ArchiveController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const archive = new Archive(new PostRepository());

    try {
      const actionStatus = await archive.execute(postId);
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
