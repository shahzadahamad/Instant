import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import GetPostCount from "../../../../application/useCases/user/post/getPostCount";

export default class GetPostCountController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const getPostCount = new GetPostCount(new PostRepository());
    try {
      const data = await getPostCount.execute(userId);
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
