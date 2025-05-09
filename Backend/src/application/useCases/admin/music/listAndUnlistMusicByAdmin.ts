import { MESSAGES } from "../../../../infrastructure/constants/messages";
import MusicRepository from "../../../repositories/admin/implements/musicRepository";

export default class ListAndUnlistMusicByAdmin {
  private musicRepository: MusicRepository;

  constructor(musicRepository: MusicRepository) {
    this.musicRepository = musicRepository;
  }

  public async execute(id: string, status: string): Promise<string> {
    if (status === "list") {
      await this.musicRepository.listAndUnlistMusic(id, true);
    } else if (status === "unlist") {
      await this.musicRepository.listAndUnlistMusic(id, false);
    } else {
      throw new Error(MESSAGES.ERROR.INVALID_ACCESS);
    }
    return MESSAGES.SUCCESS.ACTION_SUCCESS;
  }
}
