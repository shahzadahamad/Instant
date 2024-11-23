import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserPostData from "../../../../application/useCases/user/post/userPostData";
import UserRepository from "../../../../application/repositories/user/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";

export default class GetUserPostDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username = "" } = req.query;

    const userPostData = new UserPostData(
      new PostRepository(),
      new UserRepository()
    );

    try {
      const data = await userPostData.execute(userId, username as string);
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
