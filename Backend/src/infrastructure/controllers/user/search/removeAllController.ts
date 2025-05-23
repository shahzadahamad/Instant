import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import SearchHistoryRepository from "../../../../application/repositories/user/implements/searchHistoryRepository";
import RemoveAll from "../../../../application/useCases/user/search/removeAll";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class RemoveAllController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const removeAll = new RemoveAll(new SearchHistoryRepository());

    try {
      const message = await removeAll.execute(userId);
      res.status(HttpStatusCode.OK).json(message);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
