import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";
import RequestRepository from "../../../../application/repositories/user/requrestRepository";
import GetFollowDetials from "../../../../application/useCases/user/user/getFollowDetials";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";

export default class GetFollowDetialsController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username } = req.params;

    const getFollowDetials = new GetFollowDetials(new UserRepository(), new FriendsRepository(), new RequestRepository());

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
