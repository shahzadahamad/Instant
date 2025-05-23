import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import SinglePost from "../../../../application/useCases/user/post/singlePost";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class SinglePostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { postId } = req.params;

    const singlePost = new SinglePost(new PostRepository(), new UserRepository(), new FriendsRepository());

    try {
      const postData = await singlePost.execute(userId, postId);
      res.status(HttpStatusCode.OK).json(postData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
