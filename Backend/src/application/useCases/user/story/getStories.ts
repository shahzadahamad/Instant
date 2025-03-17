import { IStory } from "../../../../infrastructure/database/models/storyModal";
import { IUser } from "../../../../infrastructure/database/models/userModel";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import StoryRepository from "../../../repositories/user/storyRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetStories {
  private friendsRepository: FriendsRepository;
  private storyRepository: StoryRepository;
  private userRepository: UserRepository;

  constructor(
    friendsRepository: FriendsRepository,
    storyRepository: StoryRepository,
    userRepository: UserRepository
  ) {
    this.friendsRepository = friendsRepository;
    this.storyRepository = storyRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<{
    userStories: { userData: IUser; userStory: IStory[] } | null;
    followingsStories: { userData: IUser; userStory: IStory[] }[];
  }> {
    const followings = await this.friendsRepository.findUserDoc(userId);
    const userFollowings = followings?.followings ?? [];

    const allUsersToFetch = [...userFollowings, userId];

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const stories: IStory[] = await this.storyRepository.findStoriesByUsers(allUsersToFetch, twentyFourHoursAgo);

    const users: IUser[] = await this.userRepository.findUsersByUserIds(allUsersToFetch);

    const userMap: Map<string, IUser> = new Map(users.map((user) => [user._id.toString(), user]));

    const userStoriesMap: Map<string, IStory[]> = new Map();
    stories.forEach((story) => {
      const userIdStr = story.userId.toString();
      if (!userStoriesMap.has(userIdStr)) {
        userStoriesMap.set(userIdStr, []);
      }
      userStoriesMap.get(userIdStr)!.push(story);
    });

    const userStories = userStoriesMap.get(userId) ?? [];
    const userData = userMap.get(userId);

    const followingsStories = Array.from(userStoriesMap.entries())
      .filter(([storyUserId]) => storyUserId !== userId) 
      .map(([storyUserId, userStory]) => {
        const user = userMap.get(storyUserId);
        if (user) {
          return { userData: user, userStory };
        }
        return null;
      })
      .filter((item): item is { userData: IUser; userStory: IStory[] } => item !== null);

    return {
      userStories: userData ? { userData, userStory: userStories } : null,
      followingsStories,
    };
  }
}
