import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import PostRepository from "../../../../application/repositories/user/postRepository";
import GetUserDataByUsername from "../../../../application/useCases/user/user/getUserDataByUsername";

export default class GetUserDataByUsernameController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { username } = req.params;
    const { userId } = req.user;

    const getUserDataByUsername = new GetUserDataByUsername(
      new UserRepository(),
      new PostRepository()
    );

    try {
      const userData = await getUserDataByUsername.execute(username, userId);

      return res.status(200).json({
        postCount: userData.postCount,
        userData: userData.userWithoutSensitiveInfo,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
