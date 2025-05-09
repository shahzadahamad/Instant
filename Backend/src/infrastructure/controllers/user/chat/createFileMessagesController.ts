import { Request, Response } from "express";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import ChatRepository from "../../../../application/repositories/user/chatRepository";
import MessageRepository from "../../../../application/repositories/user/messageRepository";
import UserRepository from "../../../../application/repositories/user/userRepository";
import FileMessage from "../../../../application/useCases/user/chat/fileMessage";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class CreateFileMessagesController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const { chatId } = req.body;
    const files = req.files;

    const fileMessage = new FileMessage(new ChatRepository(), new MessageRepository(), new UserRepository(), new AwsS3Storage());
    try {
      const status = await fileMessage.execute(chatId, userId, files);
      res.status(HttpStatusCode.OK).json({ status });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}