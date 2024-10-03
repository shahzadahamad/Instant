import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetCreatePostUserData from "../../../../application/useCases/user/user/getCreatePostUserData";

export default class CretePostGetUserDataController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { searchVal } = req.query;
    console.log(searchVal)
    const getCreatePostUserData = new GetCreatePostUserData(
      new UserRepository()
    );

    try {
      const userData = await getCreatePostUserData.execute(searchVal);

      return res.status(200).json(userData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
