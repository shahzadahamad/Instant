import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import Search from "../../../../application/useCases/user/search/search";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";

export default class SearchController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { search = '' } = req.params;

    const searchData = new Search(new UserRepository(), new FriendsRepository());

    try {
      const data = await searchData.execute(userId, search);

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
