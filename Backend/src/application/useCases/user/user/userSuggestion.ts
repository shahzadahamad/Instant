import { IUser } from "../../../../infrastructure/database/models/userModel";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class UserSuggestion {
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;

  constructor(userRepository: UserRepository, friendsRepository: FriendsRepository) {
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
  }

  public async execute(userId: string, targetUserId: string, user: boolean): Promise<{ user: IUser, mutualFriends: string[] }[]> {

    const limit = 10;
    const userFriend = await this.friendsRepository.findUserDoc(userId);
    const userFriendIds = userFriend?.followings || [];
    const userFriends = await this.friendsRepository.findUserDoc(targetUserId);
    const followingIds = userFriends?.followings || [];

    const mutualFriendMap = await this.findMutualFriends(userFriendIds, user ? followingIds : userFriendIds, userId);

    const suggestedUsers = await this.userRepository.findUsersByIds([...mutualFriendMap.keys()], limit);
    const suggestionsWithMutuals = suggestedUsers.map(user => ({
      user,
      mutualFriends: mutualFriendMap.get(user._id.toString()) || []
    }));

    if (suggestionsWithMutuals.length < limit) {
      const remainingLimit = limit - suggestionsWithMutuals.length;
      const popularUsers = await this.friendsRepository.findMostFollowedUsers(
        user ? [targetUserId, userId] : [userId],
        [...userFriendIds, ...mutualFriendMap.keys()],
        remainingLimit - suggestedUsers.length
      );
      const additionalUsers = await this.userRepository.findUsersByIds(popularUsers.map(userId => userId.userId), limit);
      suggestionsWithMutuals.push(
        ...additionalUsers.map(user => ({ user, mutualFriends: [] }))
      );
    }

    return suggestionsWithMutuals;
  }

  private async findMutualFriends(userFriendIds: string[], followingIds: string[], userId: string): Promise<Map<string, string[]>> {
    const mutualFriends = await this.friendsRepository.findUsersWithFollowing(followingIds, userId);
    const mutualFriendMap = new Map<string, string[]>();

    mutualFriends.forEach(friend => {
      friend.followings.forEach(followedId => {
        if (!userFriendIds.includes(followedId) && followedId !== userId) {
          if (!mutualFriendMap.has(followedId)) {
            mutualFriendMap.set(followedId, []);
          }
          mutualFriendMap.get(followedId)!.push(friend.userId.username);
        }
      });
    });

    return mutualFriendMap;
  }
}
