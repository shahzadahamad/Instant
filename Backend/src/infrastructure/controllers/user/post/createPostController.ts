import { Request, Response } from "express";
import CreatePost from "../../../../application/useCases/user/post/createPost";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import NotificationRepository from "../../../../application/repositories/user/implements/notificationRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class CreatePostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const files = req.files;
    const { postData, music, caption, hideLikesAndViewCount, turnOffCounting, aspectRatio, } = req.body;
    const parsedPostData = JSON.parse(postData);

    const createPost = new CreatePost(new UserRepository(), new AwsS3Storage(), new PostRepository(), new NotificationRepository());

    try {
      const data = await createPost.execute(userId, caption, aspectRatio, hideLikesAndViewCount, turnOffCounting, music, parsedPostData, files);
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
