import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import Reels from "../../../../application/useCases/user/post/reels";

export default class ReelsController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const reels = new Reels(new PostRepository());

    try {
      const data = await reels.execute(userId);
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
