import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import FriendsRepository from "../../../../application/repositories/user/implements/friendsRepository";
import NotificationRepository from "../../../../application/repositories/user/implements/notificationRepository";
import UserMoreDataRepository from "../../../../application/repositories/user/implements/userMoreDataRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import RequestAcceptUser from "../../../../application/useCases/user/user/requestAcceptUser";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class AcceptRequestUserController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const { userId } = req.user;

    const requestAcceptUser = new RequestAcceptUser(new UserRepository(), new FriendsRepository(), new NotificationRepository(), new UserMoreDataRepository());

    try {
      const actionStatus = await requestAcceptUser.execute(userId, username);
      res.status(HttpStatusCode.OK).json(actionStatus);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
