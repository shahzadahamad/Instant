import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetUserDataBySearchUsername from "../../../../application/useCases/user/user/getUserDataBySearchUsername";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetUserDataBySearchingUsernameController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { search = '' } = req.params;

    const getUserDataBySearchUsername = new GetUserDataBySearchUsername(new UserRepository());

    try {
      const userData = await getUserDataBySearchUsername.execute(search as string);
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
