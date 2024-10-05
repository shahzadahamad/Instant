import MusicRepository from "../../../repositories/admin/musicRepository";

export default class ListAndUnlistMusicByAdmin {
  private musicRepository: MusicRepository;

  constructor(musicRepository: MusicRepository) {
    this.musicRepository = musicRepository;
  }

  public async execute(id: string, status: string): Promise<any> {
    if (status === "list") {
      await this.musicRepository.listAndUnlistMusic(id,true)
    } else if (status === "unlist") {
      await this.musicRepository.listAndUnlistMusic(id,false)
    } else {
      throw new Error("Invalid action");
    }
    return "action successfull"
  }
}
