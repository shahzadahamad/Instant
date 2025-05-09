import { IPostWithUserData } from "../../../interface/post";
import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import LikeRepository from "../../../repositories/user/implements/likeRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserMoreDataRepository from "../../../repositories/user/implements/userMoreDataRepository";

export default class LoadingPagePost {
  private postRepository: PostRepository;
  private userMoreDataRepository: UserMoreDataRepository;
  private friendsRepository: FriendsRepository;
  private likeRepository: LikeRepository;

  constructor(postRepository: PostRepository, friendsRepository: FriendsRepository, userMoreDataRepository: UserMoreDataRepository, likeRepository: LikeRepository) {
    this.postRepository = postRepository;
    this.userMoreDataRepository = userMoreDataRepository;
    this.friendsRepository = friendsRepository;
    this.likeRepository = likeRepository;
  }

  public async execute(userId: string, pageVal: number): Promise<{ post: IPostWithUserData[], totalPage: number }> {

    const followings = await this.friendsRepository.findUserDoc(userId);
    const userFollowings = followings?.followings ?? [];

    const page = pageVal || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const watchedReels = await this.userMoreDataRepository.findWatchedPostsById(userId);
    const userWatchedReels = watchedReels?.watchedPost ?? [];

    const postOfFriendAndNonWatched = await this.postRepository.findPostsOfFriendAndNonWatched([...userFollowings, userId], userWatchedReels, false);
    const postOfFollowedAndWatched = await this.postRepository.findPostOfFollowedUserWached(userWatchedReels, [...userFollowings, userId]);

    const post: IPostWithUserData[] = [...postOfFriendAndNonWatched, ...postOfFollowedAndWatched];

    const limitPost = post.slice(startIndex, startIndex + limit);
    const liked = await this.likeRepository.hasUserLikedPostIds(userId, limitPost.map(post => post._id.toString()));
    const updatedPosts = limitPost.map(post => ({
      ...post,
      isLiked: liked[post._id.toString()] || false,
    }));

    return {
      post: updatedPosts,
      totalPage: Math.ceil(post.length / limit)
    };
  }
}
