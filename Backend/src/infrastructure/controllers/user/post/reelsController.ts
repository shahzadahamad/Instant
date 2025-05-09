import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import Reels from "../../../../application/useCases/user/post/reels";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class ReelsController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username = "" } = req.query;

    const reels = new Reels(new PostRepository(), new UserRepository());

    try {
      const data = await reels.execute(userId, username as string);
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
