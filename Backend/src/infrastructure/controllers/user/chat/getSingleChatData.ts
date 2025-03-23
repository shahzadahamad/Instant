import { Request, Response } from "express";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import ChatRepository from "../../../../application/repositories/user/chatRepository";
import ChatById from "../../../../application/useCases/user/chat/chatById";

export default class GetSingleChatData {
  public async handle(req: Request, res: Response): Promise<void> {
    const { chatId } = req.params;

    const chatById = new ChatById(
      new ChatRepository(),
    );


    try {
      const chatData = await chatById.execute(chatId);
      res.status(HttpStatusCode.OK).json(chatData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
