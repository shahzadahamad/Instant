import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import CreateMusic from "../../../../application/useCases/admin/music/createMusic";
import { FilesType } from "../../../../application/interface/fileTypes";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";

export default class CreateMusicController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { title } = req.body;
    const files = req.files as FilesType | Express.Multer.File[];

    const createMusic = new CreateMusic(
      new MusicRepository(),
      new AwsS3Storage()
    );

    try {
      await createMusic.execute(title, files as FilesType);
      res.status(200).json({ message: "Music created successful." });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
      return;
    }
  }
}
