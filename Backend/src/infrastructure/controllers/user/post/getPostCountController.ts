import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import GetPostCount from "../../../../application/useCases/user/post/getPostCount";

export default class GetPostCountController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { userId } = req.user;
    const getPostCount = new GetPostCount(new PostRepository());
    try {
      const data = await getPostCount.execute(userId);
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
