import PostModal, {
  IPost,
} from "../../../../infrastructure/database/models/postModel";
import { IpostWithUserData, IPostWithUserData, PostData, PostFilter, QueryTypeGetPostDataAdin } from "../../../interface/post";
import { IPostRepository } from "../interfaces/IPostRepository";

export default class PostRepository implements IPostRepository {
  public async createPost(userId: string, post: PostData[], caption: string, musicId: string, hideLikeAndView: boolean, hideComment: boolean, aspectRatio: string): Promise<IPost> {
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

  public async getAllPostCount(): Promise<number> {
    try {
      return await PostModal.countDocuments();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating user: ${error.message}`);
        throw new Error("Failed to create user");
      }
      console.error("Unknown error creating user");
      throw new Error("Unknown error");
    }
  }

  public async findUserPostData(userId: string): Promise<IPost[]> {
    try {
      return await PostModal.find({ userId, isArchive: false })
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount')
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

  public async findUserTaggedPosts(userId: string): Promise<IpostWithUserData[]> {
    try {
      return await PostModal.find({
        post: {
          $elemMatch: {
            tagUsers: userId
          }
        },
        isArchive: false
      })
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount')
        .sort({ createdAt: -1 }) as IpostWithUserData[] | [];
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding post: ${error.message}`);
        throw new Error("Failed to find post");
      }
      console.error("Unknown error finding post");
      throw new Error("Unknown error");
    }
  }

  public async findLikedPostData(postIds: string[]): Promise<IPostWithUserData[]> {
    try {
      return await PostModal.find({
        _id: { $in: postIds }, isArchive: false
      })
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount')
        .sort({ createdAt: -1 }) as IpostWithUserData[] | []
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

  public async updateCommentCount(postId: string, status: boolean) {
    try {
      await PostModal.updateOne({ _id: postId }, { $inc: { commentCount: status ? 1 : -1 } });
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

  public async findPostByIdWithUserData(_id: string): Promise<IpostWithUserData | null> {
    try {
      return await PostModal.findOne({ _id: _id }).populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount') as IpostWithUserData | null;
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
      return await PostModal.findOne({ _id: _id }).populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount');
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

  public async updatePost(_id: string, caption: string, hideLikesAndViewCount: boolean, turnOffCounting: boolean) {
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

  public async reportPost(_id: string, userId: string, username: string, profilePicture: string, reason: string) {
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
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount')
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
      return await PostModal.find({ userId, isArchive: false, "post.0.type": "reel" })
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount')
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

  public async findReelById(postId: string): Promise<IPostWithUserData | null> {
    try {
      return await PostModal.findOne({ _id: postId, isArchive: false, "post.0.type": "reel" })
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount') as IPostWithUserData | null;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding reel: ${error.message}`);
        throw new Error("Failed to find reel");
      }
      console.error("Unknown error finding reel");
      throw new Error("Unknown error");
    }
  }

  public async findPostsOfFriendAndNonWatched(userIds: string[], watchedPost: string[], reel: boolean): Promise<IPostWithUserData[]> {
    try {

      const filter: PostFilter = {
        isArchive: false,
        userId: { $in: userIds },
        _id: { $nin: watchedPost },
      };

      if (reel) {
        filter["post.0.type"] = "reel";
      }

      return await PostModal.find(filter)
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount createdAt')
        .sort({ createdAt: -1 }).lean() as IPostWithUserData[] | [];

    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding reel: ${error.message}`);
        throw new Error("Failed to find reel");
      }
      console.error("Unknown error finding reel");
      throw new Error("Unknown error");
    }
  }

  public async findPostsOfNonFriendAndNonWatched(userIds: string[], watchedPost: string[], reel: boolean): Promise<IPostWithUserData[]> {
    try {

      const filter: PostFilter = {
        isArchive: false,
        userId: { $nin: userIds },
        _id: { $nin: watchedPost },
      };

      if (reel) {
        filter["post.0.type"] = "reel";
      }

      return await PostModal.find(filter)
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount')
        .sort({ createdAt: -1 }) as IPostWithUserData[] | [];
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding reel: ${error.message}`);
        throw new Error("Failed to find reel");
      }
      console.error("Unknown error finding reel");
      throw new Error("Unknown error");
    }
  }

  public async findPostOfWatched(watchedPost: string[], reel: boolean): Promise<IPostWithUserData[]> {
    try {

      const filter: PostFilter = {
        isArchive: false,
        _id: { $in: watchedPost },
      };

      if (reel) {
        filter["post.0.type"] = "reel";
      }

      return await PostModal.find(filter)
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount')
        .sort({ createdAt: -1 }) as IPostWithUserData[] | [];
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding reel: ${error.message}`);
        throw new Error("Failed to find reel");
      }
      console.error("Unknown error finding reel");
      throw new Error("Unknown error");
    }
  }

  public async findPostOfFollowedUserWached(watchedPost: string[], userIds: string[]): Promise<IPostWithUserData[]> {
    try {

      const filter: PostFilter = {
        isArchive: false,
        userId: { $in: userIds },
        _id: { $in: watchedPost },
      };

      return await PostModal.find(filter)
        .populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount createdAt')
        .sort({ createdAt: -1 }).lean() as IPostWithUserData[] | [];
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding reel: ${error.message}`);
        throw new Error("Failed to find reel");
      }
      console.error("Unknown error finding reel");
      throw new Error("Unknown error");
    }
  }

  public async getPostData(startIndex: number, limit: number, query: QueryTypeGetPostDataAdin): Promise<{ posts: IPostWithUserData[]; totalPages: number; totalPost: number }> {
    try {
      const totalPost = await PostModal.countDocuments();
      const searchTotalPost = await PostModal.countDocuments(query);
      const posts = await PostModal.find(query).populate("userId", '_id username profilePicture fullname isOnline isVerified isPrivateAccount createdAt')
        .skip(startIndex)
        .limit(limit).sort({ createdAt: -1 }) as IpostWithUserData[] | [];
      return {
        posts,
        totalPages: Math.ceil(searchTotalPost / limit),
        totalPost,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find user");
      }
      console.error("Unknown error finding user");
      throw new Error("Unknown error");
    }
  }
}

