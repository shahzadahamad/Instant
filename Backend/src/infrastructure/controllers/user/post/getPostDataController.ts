import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetPostData from "../../../../application/useCases/user/post/getPostData";

export default class GetPostDataController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { userId } = req.user;
    const { postId } = req.params;

    const getPostData = new GetPostData(
      new PostRepository(),
      new UserRepository()
    );

    try {
      const postData = await getPostData.execute(userId, postId);
      return res.status(200).json(postData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
