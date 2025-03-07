import { IMusic } from "../../../../infrastructure/database/models/musicModal";
import MusicRepository from "../../../repositories/admin/musicRepository";

export default class GetMusicData {
  private musicRepository: MusicRepository;

  constructor(adminRepository: MusicRepository) {
    this.musicRepository = adminRepository;
  }

  public async execute(pageVal: number, search: string, limit: number): Promise<{ music: IMusic[]; totalPages: number; totalMusic: number }> {
    const page = pageVal || 1;
    const startIndex = (page - 1) * limit;
    let query: {
      $or?: Array<{ title: { $regex: RegExp } }>;
    } = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [{ title: { $regex: searchRegex } }],
      };
    }
    const user = await this.musicRepository.getMusicData(
      startIndex,
      limit,
      query
    );
    return user;
  }
}
