import { Request, Response } from "express";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import NotificationRepository from "../../../../application/repositories/user/implements/notificationRepository";
import StoryRepository from "../../../../application/repositories/user/implements/storyRepository";
import CreateStory from "../../../../application/useCases/user/story/createStory";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class CreateStoryController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const file = req.file;
    const { storyData, music, type } = req.body;
    const parsedStoryData = JSON.parse(storyData);

    const createStory = new CreateStory(new UserRepository(), new AwsS3Storage(), new StoryRepository(), new NotificationRepository());

    try {
      const data = await createStory.execute(userId, music, parsedStoryData, type, file);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
