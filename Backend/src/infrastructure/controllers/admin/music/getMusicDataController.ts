import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import GetMusicData from "../../../../application/useCases/admin/music/getMusicData";

export default class GetMusicDataController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { page, search = "" } = req.query;
    const pageNumber = parseInt(page as string)

    const getMusicData = new GetMusicData(new MusicRepository());

    try {
      const musicData = await getMusicData.execute(pageNumber,search);

      return res.status(200).json(musicData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
