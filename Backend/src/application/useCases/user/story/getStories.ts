import { IStory } from "../../../../infrastructure/database/models/storyModal";
import { IUser } from "../../../../infrastructure/database/models/userModel";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import StoryRepository from "../../../repositories/user/storyRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class GetStories {
  private friendsRepository: FriendsRepository;
  private storyRepository: StoryRepository;
  private userRepository: UserRepository;

  constructor(friendsRepository: FriendsRepository, storyRepository: StoryRepository, userRepository: UserRepository) {
    this.friendsRepository = friendsRepository;
    this.storyRepository = storyRepository;
    this.userRepository = userRepository;
  }

  public async execute(userId: string): Promise<{ userData: IUser, userStory: IStory[] }[] | []> {
    const followings = await this.friendsRepository.findUserDoc(userId);
    const userFollowings = followings?.followings ?? [];

    if (userFollowings.length === 0) return [];

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const stories: IStory[] = await this.storyRepository.findStoriesByUsers(userFollowings, twentyFourHoursAgo);

    const users: IUser[] = await this.userRepository.findUsersByUserIds(userFollowings);

    const userMap: Map<string, IUser> = new Map(users.map((user) => [user._id.toString(), user]));

    const userStoriesMap: Map<string, IStory[]> = new Map();

    stories.forEach((story) => {
      const userIdStr = story.userId.toString();
      if (!userStoriesMap.has(userIdStr)) {
        userStoriesMap.set(userIdStr, []);
      }
      userStoriesMap.get(userIdStr)!.push(story);
    });

    return Array.from(userStoriesMap.entries())
      .map(([userId, userStory]) => {
        const user = userMap.get(userId);
        if (!user) return null; // Skip if user is undefined
        return { userData: user, userStory };
      })
      .filter((item): item is { userData: IUser; userStory: IStory[] } => item !== null); // Type guard

  }
}
