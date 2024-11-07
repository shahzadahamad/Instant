import { Request, Response } from "express";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import EditMusic from "../../../../application/useCases/admin/music/editMusic";

export default class EditMusicController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { _id } = req.params;
    const { title } = req.body;
    const file = req.file;

    const editMusic = new EditMusic(new MusicRepository(), new AwsS3Storage());

    try {
      await editMusic.execute(_id, title, file);
      res.status(200).json({ message: "Music Updated Successfully!" });
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
