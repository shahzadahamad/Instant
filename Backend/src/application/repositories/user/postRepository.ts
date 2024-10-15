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

  public async handleLikes(postId: string, status: boolean) {
    try {
      await PostModal.updateOne(
        { _id: postId },
        { $inc: { likeCount: status ? 1 : -1 } }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error likeCount increment post: ${error.message}`);
        throw new Error("Failed to likeCount increment post");
      }
      console.error("Unknown error likeCount increment post");
      throw new Error("Unknown error");
    }
  }

  public async findPostById(_id: string): Promise<IPost | null> {
    try {
      return await PostModal.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async deletePost(_id: string) {
    try {
      return await PostModal.deleteOne({ _id: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete post");
      throw new Error("Unknown error");
    }
  }
}
