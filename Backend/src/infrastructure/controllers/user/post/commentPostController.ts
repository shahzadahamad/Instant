import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import CommentRepository from "../../../../application/repositories/user/commentRepository";
import CommentPost from "../../../../application/useCases/user/post/commentPost";

export default class CommentPostController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { postId } = req.params;
    const { userId } = req.user;
    const { comment } = req.body;

    const commentPost = new CommentPost(
      new PostRepository(),
      new UserRepository(),
      new CommentRepository()
    );

    try {
      const data = await commentPost.execute(postId, userId, comment);
      return res.status(200).json({ data: data });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
