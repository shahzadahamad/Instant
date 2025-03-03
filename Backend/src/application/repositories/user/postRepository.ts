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
  ): Promise<IPost> {
    try {
      const newPost = await new PostModal({
        userId,
        post,
        caption,
        musicId,
        hideComment,
        hideLikeAndView,
        aspectRatio,
        reportDetials: [],
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
      return await PostModal.find({ userId, isArchive: false })
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

  public async findUserTaggedPosts(userId: string): Promise<IPost[]> {
    try {
      return await PostModal.find({
        post: {
          $elemMatch: {
            tagUsers: userId
          }
        },
        isArchive: false
      })
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

  public async findLikedPostData(postIds: string[]): Promise<IPost[]> {
    try {
      return await PostModal.find({
        _id: { $in: postIds }, isArchive: false
      })
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

  public async updateCommentCount(postId: string) {
    try {
      await PostModal.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });
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

  public async findPostByIdWithUserData(_id: string): Promise<IPost | null> {
    try {
      return await PostModal.findOne({ _id: _id }).populate("userId");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }

  public async findPostByIdWithUserData1(_id: string): Promise<IPost | null> {
    try {
      return await PostModal.findOne({ _id: _id }).populate("userId",'_id username profilePicture fullname isOnline isVerified isPrivateAccount');
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

  public async getUserPostCount(_id: string) {
    try {
      return await PostModal.countDocuments({ userId: _id });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error delete post");
      throw new Error("Unknown error");
    }
  }

  public async updatePost(
    _id: string,
    caption: string,
    hideLikesAndViewCount: boolean,
    turnOffCounting: boolean
  ) {
    try {
      return await PostModal.updateOne(
        { _id: _id },
        {
          $set: {
            caption,
            hideLikeAndView: hideLikesAndViewCount,
            hideComment: turnOffCounting,
          },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error updating post");
      throw new Error("Unknown error");
    }
  }

  public async reportPost(
    _id: string,
    userId: string,
    username: string,
    profilePicture: string,
    reason: string
  ) {
    try {
      return await PostModal.updateOne(
        { _id: _id },
        {
          $push: {
            reportDetials: {
              userId,
              username,
              profilePicture,
              reportReason: reason,
            },
          },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error updating post");
      throw new Error("Unknown error");
    }
  }

  public async archiveToggle(_id: string): Promise<IPost | null> {
    try {
      return await PostModal.findOneAndUpdate(
        { _id },
        [{ $set: { isArchive: { $not: "$isArchive" } } }],
        { new: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error updating post");
      throw new Error("Unknown error");
    }
  }

  public async findUserArchivedPost(userId: string): Promise<IPost[]> {
    try {
      return await PostModal.find({ userId, isArchive: true })
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

  public async findUserReelsPost(userId: string): Promise<IPost[]> {
    try {
      const postData = await PostModal.find({ userId, isArchive: false })
        .populate("userId")
        .sort({ createdAt: -1 });

      return postData.filter((post) => {
        return post.post[0].type === 'reel';
      });
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
