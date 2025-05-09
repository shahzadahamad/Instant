import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import FilterReels from "../../../../application/useCases/user/post/filterReels";
import UserMoreDataRepository from "../../../../application/repositories/user/implements/userMoreDataRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class FilterReelsController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { reelId = "", page = 0, load = false } = req.query;
    const { userId } = req.user;

    const boolLoad = (load === 'true');
    const pageNumber = parseInt(page as string);

    const filterReels = new FilterReels(new PostRepository(), new FriendsRepository(), new UserMoreDataRepository());

    try {
      const postData = await filterReels.execute(reelId as string, userId, pageNumber, boolLoad);
      res.status(HttpStatusCode.OK).json(postData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
