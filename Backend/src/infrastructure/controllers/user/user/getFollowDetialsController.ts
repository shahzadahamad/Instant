import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import UserMoreDataRepository from "../../../../application/repositories/user/implements/userMoreDataRepository";
import GetFollowDetials from "../../../../application/useCases/user/user/getFollowDetials";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetFollowDetialsController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username } = req.params;

    const getFollowDetials = new GetFollowDetials(new UserRepository(), new FriendsRepository(), new UserMoreDataRepository());

    try {
      const followDetials = await getFollowDetials.execute(userId, username);
      res.status(HttpStatusCode.OK).json(followDetials);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
