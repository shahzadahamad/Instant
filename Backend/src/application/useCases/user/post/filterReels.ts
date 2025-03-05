import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IPostWithUserData } from "../../../interface/post";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserMoreDataRepository from "../../../repositories/user/userMoreDataRepository";

export default class FilterReels {
  private postRepository: PostRepository;
  private userMoreDataRepository: UserMoreDataRepository;
  private friendsRepository: FriendsRepository;

  constructor(postRepository: PostRepository, friendsRepository: FriendsRepository, userMoreDataRepository: UserMoreDataRepository) {
    this.postRepository = postRepository;
    this.userMoreDataRepository = userMoreDataRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(reelId: string, userId: string, pageVal: number): Promise<IPostWithUserData[]> {


    const reelExist = await this.postRepository.findReelById(reelId);
    const followings = await this.friendsRepository.findUserDoc(userId);
    const userFollowings = followings?.followings ?? [];

    if (reelId !== MESSAGES.OTHER.REEL_ID) {
      if (!reelExist) {
        throw new Error('Reel not found.');
      }
      if (reelExist.userId.isPrivateAccount && !userFollowings.includes(reelExist.userId._id)) {
        throw new Error('Reel not found.');
      }
    }

    const page = pageVal || 1;
    const limit = 2;
    const startIndex = (page - 1) * limit;
    const watchedReels = await this.userMoreDataRepository.findWatchedPostsById(userId);

    if (!watchedReels) {
      const reels = await this.postRepository.findPosts(startIndex, limit, true);
      return reels.filter((post) => {
        return !post.userId.isPrivateAccount || userFollowings.includes(post.userId._id);
      });
    } else {

      const reelsOfFriendAndNonWatched = await this.postRepository.findPostsOfFriendAndNonWatched(startIndex, limit, userFollowings, watchedReels.watchedPost, true);
      const reelsOfNonFriendAndNonWatched = await this.postRepository.findPostsOfNonFriendAndNonWatched(startIndex, limit, userFollowings, watchedReels.watchedPost, true);
      const otherReels = await this.postRepository.findPostOfWatched(startIndex, limit, watchedReels.watchedPost, true);

      const reels: IPostWithUserData[] = [...reelsOfFriendAndNonWatched, ...reelsOfNonFriendAndNonWatched, ...otherReels];

      if (reelExist) {
        reels.unshift(reelExist);
      }

      return reels.filter((post) => {
        return !post.userId.isPrivateAccount || userFollowings.includes(post.userId._id);
      });

    }
  }
}
