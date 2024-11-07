import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import ReportPost from "../../../../application/useCases/user/post/reportPost";

export default class ReportPostController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const { reason } = req.query;
    const { userId } = req.user;

    const reportPost = new ReportPost(
      new PostRepository(),
      new UserRepository()
    );

    try {
      const actionStatus = await reportPost.execute(userId, postId, reason as string);
      res.status(200).json({ message: actionStatus });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
