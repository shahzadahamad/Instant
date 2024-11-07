import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetPostData from "../../../../application/useCases/user/post/getPostData";

export default class GetPostDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { postId } = req.params;

    const getPostData = new GetPostData(
      new PostRepository(),
      new UserRepository()
    );

    try {
      const postData = await getPostData.execute(userId, postId);
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
