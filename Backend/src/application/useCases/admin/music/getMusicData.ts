import MusicRepository from "../../../repositories/admin/musicRepository";

export default class GetMusicData {
  private musicRepository: MusicRepository;

  constructor(adminRepository: MusicRepository) {
    this.musicRepository = adminRepository;
  }

  public async execute(pageVal: number, search: any): Promise<any> {
    const page = pageVal || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    let query = {};
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
