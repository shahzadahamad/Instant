import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import GetCreatePostMusicData from "../../../../application/useCases/user/music/getCreatePostMusicData";

export default class GetCreatePostMusicDataController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { _id } = req.params;

    const getCreatePostMusicData = new GetCreatePostMusicData(
      new MusicRepository()
    );

    try {
      const musicData = await getCreatePostMusicData.execute();

      return res.status(200).json(musicData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
