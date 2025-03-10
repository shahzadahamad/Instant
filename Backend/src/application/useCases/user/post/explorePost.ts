import { IPostWithUserData } from "../../../interface/post";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserMoreDataRepository from "../../../repositories/user/userMoreDataRepository";

export default class ExplorePost {
  private postRepository: PostRepository;
  private userMoreDataRepository: UserMoreDataRepository;
  private friendsRepository: FriendsRepository;

  constructor(postRepository: PostRepository, friendsRepository: FriendsRepository, userMoreDataRepository: UserMoreDataRepository) {
    this.postRepository = postRepository;
    this.userMoreDataRepository = userMoreDataRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(userId: string, pageVal: number): Promise<{ post: IPostWithUserData[], totalPage: number }> {

    const followings = await this.friendsRepository.findUserDoc(userId);
    const userFollowings = followings?.followings ?? [];

    const page = pageVal || 1;
    const limit = 15;
    const startIndex = (page - 1) * limit;
    const watchedReels = await this.userMoreDataRepository.findWatchedPostsById(userId);
    const userWatchedReels = watchedReels?.watchedPost ?? [];

    const postOfFriendAndNonWatched = await this.postRepository.findPostsOfFriendAndNonWatched([...userFollowings, userId], userWatchedReels, false);
    const postOfNonFriendAndNonWatched = await this.postRepository.findPostsOfNonFriendAndNonWatched([...userFollowings, userId], userWatchedReels, true);
    const otherPost = await this.postRepository.findPostOfWatched(userWatchedReels, false);

    let post: IPostWithUserData[] = [...postOfFriendAndNonWatched, ...postOfNonFriendAndNonWatched, ...otherPost];

    post = post.filter((post) => {
      return !post.userId.isPrivateAccount || [...userFollowings, userId].includes(post.userId._id.toString());
    });

    return {
      post: post.slice(startIndex, startIndex + limit),
      totalPage: Math.ceil(post.length / limit)
    };
  }
}
