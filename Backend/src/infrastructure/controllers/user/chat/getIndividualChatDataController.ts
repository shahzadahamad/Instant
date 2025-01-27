import { Request, Response } from "express";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import ChatRepository from "../../../../application/repositories/user/chatRepository";
import GetIndividualChatData from "../../../../application/useCases/user/chat/getIndividualChatData";
import MessageRepository from "../../../../application/repositories/user/messageRepository";

export default class GetIndividualChatDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const getIndividualChatData = new GetIndividualChatData(
      new ChatRepository(),
      new MessageRepository(),
    );


    try {
      const chatData = await getIndividualChatData.execute(id);
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
