import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetUserDataBySearchUsername from "../../../../application/useCases/user/user/getUserDataBySearchUsername";

export default class GetUserDataBySearchingUsernameController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { search } = req.params;

    const getUserDataBySearchUsername = new GetUserDataBySearchUsername(new UserRepository());

    try {
      const userData = await getUserDataBySearchUsername.execute(search);

      res.status(200).json(userData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
