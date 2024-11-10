import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetTaggedPostData from "../../../../application/useCases/user/post/getTaggedPostData";

export default class GetTaggedPostDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username = "" } = req.query;

    const getTaggedPostData = new GetTaggedPostData(
      new PostRepository(),
      new UserRepository()
    );

    try {
      const data = await getTaggedPostData.execute(userId, username as string);
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
