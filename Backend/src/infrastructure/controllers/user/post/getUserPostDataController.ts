import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserPostData from "../../../../application/useCases/user/post/userPostData";

export default class GetUserPostDataController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { userId } = req.user;

    const userPostData = new UserPostData(new PostRepository());

    try {
      const data = await userPostData.execute(userId);
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
