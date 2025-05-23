import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IPostWithUserData } from "../../../interface/post";
import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import PostRepository from "../../../repositories/user/implements/postRepository";
import UserMoreDataRepository from "../../../repositories/user/implements/userMoreDataRepository";

export default class FilterReels {
  private postRepository: PostRepository;
  private userMoreDataRepository: UserMoreDataRepository;
  private friendsRepository: FriendsRepository;

  constructor(postRepository: PostRepository, friendsRepository: FriendsRepository, userMoreDataRepository: UserMoreDataRepository) {
    this.postRepository = postRepository;
    this.userMoreDataRepository = userMoreDataRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(reelId: string, userId: string, pageVal: number, load: boolean): Promise<{ reels: IPostWithUserData[], totalPage: number }> {

    const newReelId = load ? MESSAGES.OTHER.REEL_ID : reelId;

    const reelExist = await this.postRepository.findReelById(newReelId.toString());
    const followings = await this.friendsRepository.findUserDoc(userId);
    const userFollowings = followings?.followings ?? [];

    if (!load) {
      if (!reelExist) {
        throw new Error(MESSAGES.ERROR.REEL_NOT_FOUND);
      }
      if (reelExist.userId.isPrivateAccount && ![...userFollowings, userId].includes(reelExist.userId._id.toString())) {
        throw new Error(MESSAGES.ERROR.REEL_NOT_FOUND);
      }
    }

    const page = pageVal || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const watchedReels = await this.userMoreDataRepository.findWatchedPostsById(userId);
    const userWatchedReels = watchedReels?.watchedPost ?? [];

    const reelsOfFriendAndNonWatched = await this.postRepository.findPostsOfFriendAndNonWatched([...userFollowings, userId], userWatchedReels, true);
    const reelsOfNonFriendAndNonWatched = await this.postRepository.findPostsOfNonFriendAndNonWatched([...userFollowings, userId], userWatchedReels, true);
    const otherReels = await this.postRepository.findPostOfWatched(userWatchedReels, true);

    let reels: IPostWithUserData[] = [...reelsOfFriendAndNonWatched, ...reelsOfNonFriendAndNonWatched, ...otherReels];

    if (reelExist) {
      const index = reels.findIndex(reel => reel._id.toString() === reelExist._id.toString());

      if (index !== -1) {
        reels.splice(index, 1);
      };

      reels.unshift(reelExist);
    }

    reels = reels.filter((post) => {
      return !post.userId.isPrivateAccount || [...userFollowings, userId].includes(post.userId._id.toString());
    });

    return {
      reels: reels.slice(startIndex, startIndex + limit),
      totalPage: Math.ceil(reels.length / limit)
    };
  }
}
