import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import SearchHistoryRepository from "../../../../application/repositories/user/searchHistoryRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import SearchHistoryAdd from "../../../../application/useCases/user/search/searchHistoryAdd";

export default class SearchHistoryAddController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { _id } = req.params;

    const searchHistoryAdd = new SearchHistoryAdd(new UserRepository(), new SearchHistoryRepository());

    try {
      const data = await searchHistoryAdd.execute(userId, _id);

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
