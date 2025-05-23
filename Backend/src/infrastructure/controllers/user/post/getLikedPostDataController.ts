import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import LikeRepository from "../../../../application/repositories/user/implements/likeRepository";
import GetLikedPostData from "../../../../application/useCases/user/post/getLikedPostData";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetLikedPostDataController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username = "" } = req.query;

    const getLikedPostData = new GetLikedPostData(new PostRepository(), new UserRepository(), new LikeRepository(), new FriendsRepository());

    try {
      const data = await getLikedPostData.execute(userId, username as string);
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
