import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { ISearchHistory } from "../../../../infrastructure/database/models/searchHistoryModel";
import SearchHistoryRepository from "../../../repositories/user/implements/searchHistoryRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class SearchHistoryAdd {
  private userRepository: UserRepository;
  private searchHistoryRepository: SearchHistoryRepository;

  constructor(userRepository: UserRepository, searchHistoryRepository: SearchHistoryRepository) {
    this.userRepository = userRepository;
    this.searchHistoryRepository = searchHistoryRepository;
  };

  public async execute(userId: string, addId: string): Promise<ISearchHistory> {

    const user = await this.userRepository.findById(addId);

    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const newSearchHistory = await this.searchHistoryRepository.create(userId, addId);

    return newSearchHistory;

  }
}
