import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import GetComments from "../../../../application/useCases/user/post/getComments";
import CommentRepository from "../../../../application/repositories/user/commentRepository";
export default class GetCommentController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { postId } = req.params;

    const getComments = new GetComments(
      new PostRepository(),
      new CommentRepository()
    );

    try {
      const commentData = await getComments.execute(postId);
      return res.status(200).json({ commentData: commentData });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
