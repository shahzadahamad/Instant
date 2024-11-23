import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import LikeRepository from "../../../../application/repositories/user/likeRepository";
import CheckHasUserLikedComment from "../../../../application/useCases/user/post/checkHasUserLikedComment";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";

export default class CheckingHasUserLikedCommentController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const { userId } = req.user;
    const { commentIds = "" } = req.query as { commentIds: string };
    const checkHasUserLikedComment = new CheckHasUserLikedComment(
      new PostRepository(),
      new LikeRepository()
    );

    const commentIdsArray = commentIds.split(",");

    try {
      const checkDetials = await checkHasUserLikedComment.execute(
        postId,
        userId,
        commentIdsArray
      );
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
