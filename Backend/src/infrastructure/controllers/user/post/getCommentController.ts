import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import GetComments from "../../../../application/useCases/user/post/getComments";
import CommentRepository from "../../../../application/repositories/user/commentRepository";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";

export default class GetCommentController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;

    const getComments = new GetComments(
      new PostRepository(),
      new CommentRepository()
    );

    try {
      const commentData = await getComments.execute(postId);
      res.status(HttpStatusCode.OK).json({ commentData: commentData });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
