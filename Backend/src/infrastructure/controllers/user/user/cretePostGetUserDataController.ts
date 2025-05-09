import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import GetCreatePostUserData from "../../../../application/useCases/user/user/getCreatePostUserData";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class CretePostGetUserDataController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { search = '', users } = req.query;
    const { userId } = req.user;
    const getCreatePostUserData = new GetCreatePostUserData(new UserRepository(), new FriendsRepository());

    try {
      const userData = await getCreatePostUserData.execute(search as string, users as string[], userId);
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
