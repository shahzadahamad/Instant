import AwsS3Storage from "../../../providers/awsS3Storage";
import MusicRepository from "../../../repositories/admin/musicRepository";

export default class EditMusic {
  private musicRepository: MusicRepository;
  private awsS3Storage: AwsS3Storage;

  constructor(musicRepository: MusicRepository, awsS3Storage: AwsS3Storage) {
    this.musicRepository = musicRepository;
    this.awsS3Storage = awsS3Storage;
  }

  public async execute(
    id: string,
    title: string,
    file?: Express.Multer.File
  ): Promise<void> {
    const music = await this.musicRepository.findMusicById(id);

    if (!music) {
      throw new Error("Invalied Access!");
    }

    let fileUrl;

    if (file) {
      await this.awsS3Storage.deleteFile(music.image);
      fileUrl = await this.awsS3Storage.uploadFile(file, "music-image");
    }

    await this.musicRepository.updateMusic(
      id,
      title,
      fileUrl
    );
  }
}
