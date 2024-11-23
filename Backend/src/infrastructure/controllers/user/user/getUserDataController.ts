import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetUserData from "../../../../application/useCases/user/user/getUserData";
import { HttpStatusCode } from "../../../enums/enums";

export default class GetUserDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const getUserData = new GetUserData(new UserRepository());

    try {
      const userData = await getUserData.execute(userId);

      res.status(HttpStatusCode.OK).json(userData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Unknown error" });
    }
  }
}
