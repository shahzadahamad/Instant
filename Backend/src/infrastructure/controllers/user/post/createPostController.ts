import { Request, Response } from "express";
import CreatePost from "../../../../application/useCases/user/post/createPost";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import UserRepository from "../../../../application/repositories/user/userRepository";
import PostRepository from "../../../../application/repositories/user/postRepository";

export default class CreatePostController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { userId } = req.user;
    const files = req.files;
    const {
      postData,
      music,
      caption,
      hideLikesAndViewCount,
      turnOffCounting,
      aspectRatio,
    } = req.body;
    const parsedPostData = JSON.parse(postData);

    const createPost = new CreatePost(
      new UserRepository(),
      new AwsS3Storage(),
      new PostRepository()
    );

    try {
      const data = await createPost.execute(
        userId,
        caption,
        aspectRatio,
        hideLikesAndViewCount,
        turnOffCounting,
        music,
        parsedPostData,
        files
      );
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
