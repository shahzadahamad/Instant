import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import UserMoreDataRepository from "../../../../application/repositories/user/implements/userMoreDataRepository";
import ExplorePost from "../../../../application/useCases/user/post/explorePost";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class ExplorePostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { page = 0 } = req.query;
    const { userId } = req.user;
    const pageNumber = parseInt(page as string);

    const explorePost = new ExplorePost(new PostRepository(), new FriendsRepository(), new UserMoreDataRepository());

    try {
      const postData = await explorePost.execute(userId, pageNumber);
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
