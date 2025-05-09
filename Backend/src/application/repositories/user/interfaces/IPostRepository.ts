import { IPost } from "../../../../infrastructure/database/models/postModel";
import { IPostWithUserData, IpostWithUserData, PostData, QueryTypeGetPostDataAdin } from "../../../interface/post";

export interface IPostRepository {
  createPost(userId: string, post: PostData[], caption: string, musicId: string, hideLikeAndView: boolean, hideComment: boolean, aspectRatio: string): Promise<IPost>;
  getAllPostCount(): Promise<number>;
  findUserPostData(userId: string): Promise<IPost[]>;
  findUserTaggedPosts(userId: string): Promise<IpostWithUserData[]>;
  findLikedPostData(postIds: string[]): Promise<IPostWithUserData[]>;
  handleLikes(postId: string, status: boolean): void;
  updateCommentCount(postId: string, status: boolean): void;
  findPostById(_id: string): Promise<IPost | null>;
  findPostByIdWithUserData(_id: string): Promise<IpostWithUserData | null>;
  findPostByIdWithUserData1(_id: string): Promise<IPost | null>;
  deletePost(_id: string): void;
  getUserPostCount(_id: string): void;
  updatePost(_id: string, caption: string, hideLikesAndViewCount: boolean, turnOffCounting: boolean): void;
  reportPost(_id: string, userId: string, username: string, profilePicture: string, reason: string): void;
  archiveToggle(_id: string): Promise<IPost | null>;
  findUserArchivedPost(userId: string): Promise<IPost[]>;
  findUserReelsPost(userId: string): Promise<IPost[]>;
  findReelById(postId: string): Promise<IPostWithUserData | null>
  findPostsOfFriendAndNonWatched(userIds: string[], watchedPost: string[], reel: boolean): Promise<IPostWithUserData[]>;
  findPostsOfNonFriendAndNonWatched(userIds: string[], watchedPost: string[], reel: boolean): Promise<IPostWithUserData[]>;
  findPostOfWatched(watchedPost: string[], reel: boolean): Promise<IPostWithUserData[]>;
  findPostOfFollowedUserWached(watchedPost: string[], userIds: string[]): Promise<IPostWithUserData[]>;
  getPostData(startIndex: number, limit: number, query: QueryTypeGetPostDataAdin): Promise<{ posts: IPostWithUserData[]; totalPages: number; totalPost: number }>;
}