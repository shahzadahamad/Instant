import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import DeletePost from "../../../../application/useCases/user/post/deletePost";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import LikeRepository from "../../../../application/repositories/user/likeRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import CommentRepository from "../../../../application/repositories/user/commentRepository";

export default class DeletePostController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const { userId } = req.user;

    const deletePost = new DeletePost(
      new PostRepository(),
      new AwsS3Storage(),
      new LikeRepository(),
      new UserRepository(),
      new CommentRepository()
    );

    try {
      const data = await deletePost.execute(postId, userId);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
