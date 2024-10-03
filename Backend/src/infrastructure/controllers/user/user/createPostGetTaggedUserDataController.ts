import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetCreatePostTaggedUserData from "../../../../application/useCases/user/user/getCreatePostTaggedUserData";

export default class CreatePostGetTaggedUserDataController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { taggedUsers } = req.query;
    const getCreatePostUserData = new GetCreatePostTaggedUserData(
      new UserRepository()
    );

    try {
      const userData = await getCreatePostUserData.execute(taggedUsers);

      return res.status(200).json(userData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
