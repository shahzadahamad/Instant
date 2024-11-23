import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";
import NotificationRepository from "../../../../application/repositories/user/notificationRepository";
import FollowUser from "../../../../application/useCases/user/user/followUser";
import RequestRepository from "../../../../application/repositories/user/requrestRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";

export default class FollowUserController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const { userId } = req.user;

    const followUser = new FollowUser(new UserRepository(), new FriendsRepository(), new NotificationRepository(), new RequestRepository());

    try {
      const actionStatus = await followUser.execute(userId, username);

      res.status(HttpStatusCode.OK).json(actionStatus);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
