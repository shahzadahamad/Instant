import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";
import NotificationRepository from "../../../../application/repositories/user/notificationRepository";
import FollowUser from "../../../../application/useCases/user/user/followUser";

export default class FollowUserController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const { userId } = req.user;

    const followUser = new FollowUser(new UserRepository(), new FriendsRepository, new NotificationRepository);

    try {
      const actionStatus = await followUser.execute(userId, username);

      res.status(200).json({ status: actionStatus, message: 'Action successfull' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
