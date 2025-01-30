import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import UserData from "../../../../application/useCases/user/user/userData";

export default class UserDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { _id } = req.params;

    const userData = new UserData(new UserRepository());

    try {
      const data = await userData.execute(_id);

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
