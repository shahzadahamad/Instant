import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetPostData from "../../../../application/useCases/user/post/getPostData";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetPostDataController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { postId } = req.params;

    const getPostData = new GetPostData(new PostRepository(), new UserRepository());

    try {
      const postData = await getPostData.execute(userId, postId);
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
