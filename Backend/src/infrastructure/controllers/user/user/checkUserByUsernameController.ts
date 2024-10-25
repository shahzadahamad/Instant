import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import CheckUserByUsername from "../../../../application/useCases/user/user/checkUserByUsername";

export default class CheckUserByUsernameController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { username } = req.params;

    const checkUserByUsername = new CheckUserByUsername(new UserRepository());

    const data = await checkUserByUsername.execute(username);

    try {
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
