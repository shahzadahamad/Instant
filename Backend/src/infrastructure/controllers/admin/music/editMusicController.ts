import { Request, Response } from "express";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import MusicRepository from "../../../../application/repositories/admin/implements/musicRepository";
import EditMusic from "../../../../application/useCases/admin/music/editMusic";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class EditMusicController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { _id } = req.params;
    const { title } = req.body;
    const file = req.file;

    const editMusic = new EditMusic(new MusicRepository(), new AwsS3Storage());

    try {
      await editMusic.execute(_id, title, file);
      res.status(HttpStatusCode.OK).json({ message: MESSAGES.SUCCESS.MUSIC_UPDATED });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
