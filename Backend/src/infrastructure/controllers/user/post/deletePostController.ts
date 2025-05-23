import { Request, Response } from "express";
import PostRepository from "../../../../application/repositories/user/implements/postRepository";
import DeletePost from "../../../../application/useCases/user/post/deletePost";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import LikeRepository from "../../../../application/repositories/user/implements/likeRepository";
import UserRepository from "../../../../application/repositories/user/implements/userRepository";
import CommentRepository from "../../../../application/repositories/user/implements/commentRepository";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import NotificationRepository from "../../../../application/repositories/user/implements/notificationRepository";
import MessageRepository from "../../../../application/repositories/user/implements/messageRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class DeletePostController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const { userId } = req.user;

    const deletePost = new DeletePost(new PostRepository(), new AwsS3Storage(), new LikeRepository(), new UserRepository(), new CommentRepository(), new NotificationRepository(), new MessageRepository());

    try {
      const data = await deletePost.execute(postId, userId);
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
