import { IFriends } from "../../../../infrastructure/database/models/friendsModal";
import FriendsRepository from "../../../repositories/user/friendsRepository";

export default class FollowingAndFollower {
  private friendsRepository: FriendsRepository;

  constructor(friendsRepository: FriendsRepository) {
    this.friendsRepository = friendsRepository;
  }

  public async execute(userId: string): Promise<IFriends | null> {
    const friends = await this.friendsRepository.findUserDoc(userId);
    return friends;
  }
}
