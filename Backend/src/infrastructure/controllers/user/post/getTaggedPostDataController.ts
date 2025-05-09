import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import GetTaggedPostData from "../../../../application/useCases/user/post/getTaggedPostData";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetTaggedPostDataController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username = "" } = req.query;

    const getTaggedPostData = new GetTaggedPostData(new PostRepository(), new UserRepository(), new FriendsRepository());

    try {
      const data = await getTaggedPostData.execute(userId, username as string);
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
