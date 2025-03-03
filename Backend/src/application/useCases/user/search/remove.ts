import SearchHistoryRepository from "../../../repositories/user/searchHistoryRepository";

export default class Remove {
  private searchHistoryRepository: SearchHistoryRepository;

  constructor(searchHistoryRepository: SearchHistoryRepository) {
    this.searchHistoryRepository = searchHistoryRepository;
  };

  public async execute(userId: string, removeId: string): Promise<string> {
    return await this.searchHistoryRepository.remove(userId, removeId);
  }
}
