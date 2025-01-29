import { Request, Response } from "express";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import ChatRepository from "../../../../application/repositories/user/chatRepository";
import CreateChat from "../../../../application/useCases/user/chat/createChat";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";

export default class CreateChatController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userIds, groupName } = req.body;
    const { userId } = req.user;
    const file = req.file;

    const parsedUserIds = JSON.parse(userIds);

    const createChat = new CreateChat(
      new ChatRepository(),
      new AwsS3Storage()
    );

    try {
      const chatId = await createChat.execute(
        parsedUserIds,
        userId,
        groupName,
        file
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
