import { Request, Response } from "express";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import ChatRepository from "../../../../application/repositories/user/implements/chatRepository";
import GetChatList from "../../../../application/useCases/user/chat/getChatList";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetChatListController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { type } = req.params;

    const getChatList = new GetChatList(new ChatRepository());

    try {
      const chatList = await getChatList.execute(userId, type);
      res.status(HttpStatusCode.OK).json(chatList);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
