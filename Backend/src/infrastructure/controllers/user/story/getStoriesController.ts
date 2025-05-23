import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import StoryRepository from "../../../../application/repositories/user/implements/storyRepository";
import GetStories from "../../../../application/useCases/user/story/getStories";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetStoriesController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const getStories = new GetStories(new FriendsRepository(), new StoryRepository(), new UserRepository());
    try {
      const stories = await getStories.execute(userId);
      res.status(HttpStatusCode.OK).json(stories);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
