import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import LikeRepository from "../../../../application/repositories/user/likeRepository";
import CheckHasUserLikedPost from "../../../../application/useCases/user/post/checkHasUserLikedPost";

export default class CheckingHasUserLikedPostController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { postId } = req.params;
    const { userId } = req.user;
    const checkHasUserLikedPost = new CheckHasUserLikedPost(
      new PostRepository(),
      new LikeRepository()
    );

    try {
      const checkDetials = await checkHasUserLikedPost.execute(postId, userId);
      return res.status(200).json(checkDetials);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
