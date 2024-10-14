import PostModal, {
  IPost,
} from "../../../infrastructure/database/models/postModel";
import { PostData } from "../../interface/post";

export default class PostRepository {
  public async createPost(
    userId: string,
    post: PostData[],
    caption: string,
    musicId: string,
    hideLikeAndView: boolean,
    hideComment: boolean,
    aspectRatio: string
  ): Promise<any> {
    try {
      const newPost = await new PostModal({
        userId,
        post,
        caption,
        musicId,
        hideComment,
        hideLikeAndView,
        aspectRatio,
      });
      return await newPost.save();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating post: ${error.message}`);
        throw new Error("Failed to create post");
      }
      console.error("Unknown error creating post");
      throw new Error("Unknown error");
    }
  }

  public async findUserPostData(userId: string): Promise<IPost[]> {
    try {
      return await PostModal.find({ userId })
        .populate("userId")
        .sort({ createdAt: -1 });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding post: ${error.message}`);
        throw new Error("Failed to find post");
      }
      console.error("Unknown error finding post");
      throw new Error("Unknown error");
    }
  }
}
