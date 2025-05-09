import SearchHistoryRepository from "../../../repositories/user/implements/searchHistoryRepository";

export default class Remove {
  private searchHistoryRepository: SearchHistoryRepository;

  constructor(searchHistoryRepository: SearchHistoryRepository) {
    this.searchHistoryRepository = searchHistoryRepository;
  };

  public async execute(userId: string, removeId: string): Promise<string> {
    return await this.searchHistoryRepository.remove(userId, removeId);
  }
}
