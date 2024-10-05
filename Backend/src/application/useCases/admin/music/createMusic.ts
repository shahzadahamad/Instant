import { IMusic } from "../../../../infrastructure/database/models/musicModal";
import { FilesType } from "../../../interface/fileTypes";
import AwsS3Storage from "../../../providers/awsS3Storage";
import MusicRepository from "../../../repositories/admin/musicRepository";

export default class CreateMusic {
  private musicRepository: MusicRepository;
  private awsS3Storage: AwsS3Storage;

  constructor(musicRepository: MusicRepository, awsS3Storage: AwsS3Storage) {
    this.musicRepository = musicRepository;
    this.awsS3Storage = awsS3Storage;
  }

  public async execute(title: string, files: FilesType): Promise<IMusic> {
    const imageFile = files && files.image ? files.image[0] : null;
    const audioFile = files && files.audio ? files.audio[0] : null;

    if (!title) {
      throw new Error("Title is required.");
    }

    if (!imageFile || !audioFile) {
      throw new Error("Image and audio files are required.");
    }

    const existMusic = await this.musicRepository.findMusic(title);

    if (existMusic) {
      throw new Error("Music title already exist.");
    }

    const imageFileUrl = await this.awsS3Storage.uploadFile(
      imageFile,
      "music-image"
    );
    const audioFileUrl = await this.awsS3Storage.uploadFile(audioFile, "music");

    const newMusic = await this.musicRepository.createMusic(
      title,
      imageFileUrl,
      audioFileUrl
    );

    if (!newMusic) {
      throw new Error("Cannot add music.");
    }

    return newMusic;
  }
}
