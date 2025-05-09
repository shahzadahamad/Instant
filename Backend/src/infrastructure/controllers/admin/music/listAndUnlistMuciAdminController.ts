import { Request, Response } from "express";
import MusicRepository from "../../../../application/repositories/admin/implements/musicRepository";
import ListAndUnlistMusicByAdmin from "../../../../application/useCases/admin/music/listAndUnlistMusicByAdmin";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class ListAndUnlistMuciAdminController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { id, status } = req.params;
    const listAndUnlistMusicByAdmin = new ListAndUnlistMusicByAdmin(new MusicRepository());

    try {
      const actionStatus = await listAndUnlistMusicByAdmin.execute(id, status);
      res.status(HttpStatusCode.OK).json(actionStatus);
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