import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import GetUserData from "../../../../application/useCases/user/user/getUserData";
import { HttpStatusCode } from "../../../enums/enums";
import { IControllerHandler } from "../../interfaces/IControllerHandler";
import { MESSAGES } from "../../../constants/messages";

export default class GetUserDataController implements IControllerHandler {
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
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
