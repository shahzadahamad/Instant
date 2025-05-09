import { Request, Response } from "express";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FollowingAndFollower from "../../../../application/useCases/user/user/followingAndFollower";
import UserMoreDataRepository from "../../../../application/repositories/user/implements/userMoreDataRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class FollowingAndFollowerController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { _id = "" } = req.query;

    const followingAndFollower = new FollowingAndFollower(new FriendsRepository(), new UserMoreDataRepository());

    try {
      const friendData = await followingAndFollower.execute(userId, _id as string);
      res.status(HttpStatusCode.OK).json(friendData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
