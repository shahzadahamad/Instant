import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import GetCreatePostSelectedMusicData from "../../../../application/useCases/user/music/getCreatePostSelectedMusicData";

export default class GetCreatePostSelectMusicDataController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { _id } = req.params;

    const getCreatePostSelectedMusicData = new GetCreatePostSelectedMusicData(
      new MusicRepository()
    );

    try {
      const musicData = await getCreatePostSelectedMusicData.execute(_id);

      return res.status(200).json(musicData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
