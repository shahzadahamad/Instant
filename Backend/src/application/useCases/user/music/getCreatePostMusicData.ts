import { IMusic } from "../../../../infrastructure/database/models/musicModal";
import MusicRepository from "../../../repositories/admin/musicRepository";

export default class GetCreatePostMusicData {
  private musicRepository: MusicRepository;

  constructor(musicRepository: MusicRepository) {
    this.musicRepository = musicRepository;
  }

  public async execute(): Promise<IMusic[]> {
    const allMusic = this.musicRepository.findAllMusic();
    return allMusic;
  }
}
