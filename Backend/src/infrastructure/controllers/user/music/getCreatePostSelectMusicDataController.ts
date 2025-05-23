import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/implements/musicRepository";
import GetCreatePostSelectedMusicData from "../../../../application/useCases/user/music/getCreatePostSelectedMusicData";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetCreatePostSelectMusicDataController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { _id } = req.params;

    const getCreatePostSelectedMusicData = new GetCreatePostSelectedMusicData(new MusicRepository());

    try {
      const musicData = await getCreatePostSelectedMusicData.execute(_id);
      if (musicData) {
        res.status(HttpStatusCode.OK).json(musicData);
        return;
      }
      res.status(200).json({ message: MESSAGES.ERROR.MUSIC_NOT_FOUND });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
