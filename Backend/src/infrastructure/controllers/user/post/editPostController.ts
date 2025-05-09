import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import EditPost from "../../../../application/useCases/user/post/editPost";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class EditPostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { postId } = req.params;
    const { caption, hideLikeAndViewCount, turnOffCounting } = req.body;

    const editPost = new EditPost(new PostRepository(), new UserRepository());

    try {
      const postData = await editPost.execute(userId, postId, caption, hideLikeAndViewCount, turnOffCounting);
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
