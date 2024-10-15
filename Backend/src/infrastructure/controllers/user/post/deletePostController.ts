import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import DeletePost from "../../../../application/useCases/user/post/deletePost";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import LikeRepository from "../../../../application/repositories/user/likeRepository";

export default class DeletePostController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { postId } = req.params;

    const deletePost = new DeletePost(
      new PostRepository(),
      new AwsS3Storage(),
      new LikeRepository()
    );

    try {
      const data = await deletePost.execute(postId);
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
