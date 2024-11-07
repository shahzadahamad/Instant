import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/musicRepository";
import ListAndUnlistMusicByAdmin from "../../../../application/useCases/admin/music/listAndUnlistMusicByAdmin";

export default class ListAndUnlistMuciAdminController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { id, status } = req.params;
    const listAndUnlistMusicByAdmin = new ListAndUnlistMusicByAdmin(
      new MusicRepository()
    );

    try {
      const actionStatus = await listAndUnlistMusicByAdmin.execute(id, status);
      res.status(200).json(actionStatus);
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