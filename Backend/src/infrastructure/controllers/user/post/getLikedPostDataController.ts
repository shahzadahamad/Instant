import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/postRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import LikeRepository from "../../../../application/repositories/user/likeRepository";
import GetLikedPostData from "../../../../application/useCases/user/post/getLikedPostData";

export default class GetLikedPostDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { username = "" } = req.query;

    const getLikedPostData = new GetLikedPostData(
      new PostRepository(),
      new UserRepository(),
      new LikeRepository()
    );

    try {
      const data = await getLikedPostData.execute(userId, username as string);
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
