import { IMusic } from "../../../../infrastructure/database/models/musicModal";
import MusicRepository from "../../../repositories/admin/implements/musicRepository";

export default class GetCreatePostSelectedMusicData {
  private musicRepository: MusicRepository;

  constructor(musicRepository: MusicRepository) {
    this.musicRepository = musicRepository;
  }

  public async execute(_id: string): Promise<IMusic | null> {
    const allMusic = this.musicRepository.findById(_id);
    return allMusic;
  }
}
