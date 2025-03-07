import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import GetMusicData from "../../../../application/useCases/admin/music/getMusicData";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";

export default class GetMusicDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { page, search = "", limit } = req.query;
    const pageNumber = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);

    const getMusicData = new GetMusicData(new MusicRepository());

    try {
      const musicData = await getMusicData.execute(pageNumber, search as string, parsedLimit);

      res.status(HttpStatusCode.OK).json(musicData);
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
