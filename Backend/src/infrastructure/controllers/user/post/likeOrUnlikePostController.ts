import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import LikeRepository from "../../../../application/repositories/user/likeRepository";
import LikeOrUnlikePost from "../../../../application/useCases/user/post/likeOrUnlikePost";

export default class LikeOrUnlikePostController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { postId, status } = req.params;
    const { userId } = req.user;
    const likeOrUnlikePost = new LikeOrUnlikePost(
      new PostRepository(),
      new LikeRepository()
    );

    try {
      const actionStatus = await likeOrUnlikePost.execute(postId, userId,status);
      return res.status(200).json(actionStatus);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
