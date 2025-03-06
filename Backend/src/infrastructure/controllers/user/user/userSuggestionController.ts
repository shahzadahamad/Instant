import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";
import UserSuggestion from "../../../../application/useCases/user/user/userSuggestion";

export default class UserSuggestionController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { _id = '' } = req.query;
    const { user } = req.params;

    const userSuggestion = new UserSuggestion(new UserRepository(), new FriendsRepository());

    try {
      const data = await userSuggestion.execute(userId, _id as string, user);
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
