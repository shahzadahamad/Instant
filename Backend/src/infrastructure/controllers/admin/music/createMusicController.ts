import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import CreateMusic from "../../../../application/useCases/admin/music/createMusic";
import { FilesType } from "../../../../application/interface/fileTypes";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";

export default class CreateMusicController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { title } = req.body;
    const files = req.files as FilesType | Express.Multer.File[];

    const createMusic = new CreateMusic(
      new MusicRepository(),
      new AwsS3Storage()
    );

    try {
      const musicData = await createMusic.execute(title, files as FilesType);
      return res.status(200).json(musicData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
