import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import PostRepository from "../../../../application/repositories/user/postRepository";
import GetUserDataByUsername from "../../../../application/useCases/user/user/getUserDataByUsername";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";

export default class GetUserDataByUsernameController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const { userId } = req.user;

    const getUserDataByUsername = new GetUserDataByUsername(
      new UserRepository(),
      new PostRepository(),
      new FriendsRepository(),
    );

    try {
      const userData = await getUserDataByUsername.execute(username, userId);

      res.status(HttpStatusCode.OK).json({
        postCount: userData.postCount,
        userData: userData.userWithoutSensitiveInfo,
        followings: userData.followings,
        followers: userData.followers,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
