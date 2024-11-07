import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import GetCreatePostSelectedMusicData from "../../../../application/useCases/user/music/getCreatePostSelectedMusicData";

export default class GetCreatePostSelectMusicDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { _id } = req.params;

    const getCreatePostSelectedMusicData = new GetCreatePostSelectedMusicData(
      new MusicRepository()
    );

    try {
      const musicData = await getCreatePostSelectedMusicData.execute(_id);
      if (musicData) {
        res.status(200).json(musicData);
        return;
      }
      res.status(200).json({ message: "Music not available" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
