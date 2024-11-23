import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import GetCreatePostMusicData from "../../../../application/useCases/user/music/getCreatePostMusicData";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";

export default class GetCreatePostMusicDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { searchVal = "" } = req.query;
    const getCreatePostMusicData = new GetCreatePostMusicData(
      new MusicRepository()
    );

    try {
      const musicData = await getCreatePostMusicData.execute(searchVal as string);

      res.status(HttpStatusCode.OK).json(musicData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
