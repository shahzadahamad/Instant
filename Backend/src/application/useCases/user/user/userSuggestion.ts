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

  public async execute(userId: string, targetUserId: string, user: string): Promise<IUser[] | void> {

    const limit = 10;
    const userFriend = await this.friendsRepository.findUserDoc(userId);
    const userFriendIds = userFriend?.followings || [];
    const userFriends = await this.friendsRepository.findUserDoc(targetUserId);
    const followingIds = userFriends?.followings || [];

    const mutualFriendIds = await this.findMutualFriends(userFriendIds, user ? followingIds : userFriendIds, userId);

    const suggestedUsers = await this.userRepository.findUsersByIds(mutualFriendIds, limit);

    if (suggestedUsers.length < limit) {
      const remainingLimit = limit - suggestedUsers.length;
      const popularUsers = await this.friendsRepository.findMostFollowedUsers(
        user ? [targetUserId, userId] : [userId],
        [...userFriendIds, ...mutualFriendIds],
        remainingLimit - suggestedUsers.length
      );
      const additionalUsers = await this.userRepository.findUsersByIds(popularUsers.map(userId => userId.userId), limit);
      suggestedUsers.push(...additionalUsers);
    }

    return suggestedUsers;
  }

  private async findMutualFriends(userFriendIds: string[], followingIds: string[], userId: string): Promise<string[]> {
    const mutualFriends = await this.friendsRepository.findUsersWithFollowing(followingIds, userId);
    const uniqueFriendIds = new Set<string>();

    mutualFriends.forEach(friend => {
      friend.followings.forEach(followedId => {
        if (!userFriendIds.includes(followedId) && followedId !== userId) {
          uniqueFriendIds.add(followedId);
        }
      });
    });

    return Array.from(uniqueFriendIds);
  }
}
