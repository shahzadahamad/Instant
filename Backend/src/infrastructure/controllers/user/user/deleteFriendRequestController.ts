import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import NotificationRepository from "../../../../application/repositories/user/implements/notificationRepository";
import UserMoreDataRepository from "../../../../application/repositories/user/implements/userMoreDataRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import DeleteFriendRequest from "../../../../application/useCases/user/user/deleteFriendRequest";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class DeleteFriendRequestController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const { userId } = req.user;

    const deleteFriendRequest = new DeleteFriendRequest(new UserRepository(), new NotificationRepository(), new UserMoreDataRepository());

    try {
      const actionStatus = await deleteFriendRequest.execute(userId, username);
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
