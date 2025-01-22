import { Request, Response } from "express";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import ChatRepository from "../../../../application/repositories/user/chatRepository";
import CreateChat from "../../../../application/useCases/user/chat/createChat";

export default class CreateChatController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { userId } = req.user;

    const createChat = new CreateChat(
      new ChatRepository(),
    );


    try {
      const chatId = await createChat.execute(
        id,
        userId,
      );
      res.status(HttpStatusCode.OK).json(chatId);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
