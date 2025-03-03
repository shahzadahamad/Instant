import { MESSAGES } from "../../../../infrastructure/constants/messages";
import SearchHistoryRepository from "../../../repositories/user/searchHistoryRepository";

export default class RemoveAll {
  private searchHistoryRepository: SearchHistoryRepository;

  constructor(searchHistoryRepository: SearchHistoryRepository) {
    this.searchHistoryRepository = searchHistoryRepository;
  };

  public async execute(userId: string): Promise<string> {
    await this.searchHistoryRepository.removeAll(userId);
    return MESSAGES.SUCCESS.SEARCH_HISTORY_CLEARED;
  }
}
