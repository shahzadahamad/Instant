import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";
import SearchHistory from "../../../../application/useCases/user/search/searchHistory";
import SearchHistoryRepository from "../../../../application/repositories/user/searchHistoryRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class SearchHistoryController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const searchHistory = new SearchHistory(new FriendsRepository(), new SearchHistoryRepository());

    try {
      const data = await searchHistory.execute(userId);
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
