import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";
import RequestRepository from "../../../../application/repositories/user/requrestRepository";
import GetFollowDetials from "../../../../application/useCases/user/user/getFollowDetials";

export default class GetFollowDetialsController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username } = req.params;

    const getFollowDetials = new GetFollowDetials(new UserRepository(), new FriendsRepository(), new RequestRepository());

    try {
      const followDetials = await getFollowDetials.execute(userId, username);

      res.status(200).json(followDetials);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
