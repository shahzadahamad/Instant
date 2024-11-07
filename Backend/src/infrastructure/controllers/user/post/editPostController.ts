import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import EditPost from "../../../../application/useCases/user/post/editPost";

export default class EditPostController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { postId } = req.params;
    const { caption, hideLikeAndViewCount, turnOffCounting } = req.body;

    const editPost = new EditPost(new PostRepository(), new UserRepository());

    try {
      const postData = await editPost.execute(
        userId,
        postId,
        caption,
        hideLikeAndViewCount,
        turnOffCounting
      );
      res.status(200).json(postData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
