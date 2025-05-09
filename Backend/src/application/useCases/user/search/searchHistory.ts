import { SearchHisotry } from "../../../interface/search";
import FriendsRepository from "../../../repositories/user/implements/friendsRepository";
import SearchHistoryRepository from "../../../repositories/user/implements/searchHistoryRepository";

export default class SearchHistory {
  private friendsRepository: FriendsRepository;
  private searchHistoryRepository: SearchHistoryRepository;

  constructor(friendsRepository: FriendsRepository, searchHistoryRepository: SearchHistoryRepository) {
    this.friendsRepository = friendsRepository;
    this.searchHistoryRepository = searchHistoryRepository;
  };

  public async execute(userId: string): Promise<{ history: SearchHisotry[]; userId: string; _id: string } | null> {

    const searchHistoryData = await this.searchHistoryRepository.findById(userId);

    if (!searchHistoryData || searchHistoryData.history.length <= 0) {
      return null;
    }

    const friends = await this.friendsRepository.findUserDoc(userId);

    const filterSearchData = searchHistoryData.history.map((user) => {
      return {
        ...user,
        isFollowed: friends?.followings ? friends.followings.includes(user._id.toString()) : false,
      };
    });
    return { ...searchHistoryData, history: filterSearchData };
  }
}
