import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import LikeRepository from "../../../../application/repositories/user/likeRepository";
import CheckHasUserLikedPost from "../../../../application/useCases/user/post/checkHasUserLikedPost";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";

export default class CheckingHasUserLikedPostController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const { userId } = req.user;
    const checkHasUserLikedPost = new CheckHasUserLikedPost(
      new PostRepository(),
      new LikeRepository()
    );

    try {
      const checkDetials = await checkHasUserLikedPost.execute(postId, userId);
      res.status(HttpStatusCode.OK).json(checkDetials);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
