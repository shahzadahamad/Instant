import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import CheckUserByUsername from "../../../../application/useCases/user/user/checkUserByUsername";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";

export default class CheckUserByUsernameController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { username } = req.params;

    const checkUserByUsername = new CheckUserByUsername(new UserRepository());

    const data = await checkUserByUsername.execute(username);

    try {
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
