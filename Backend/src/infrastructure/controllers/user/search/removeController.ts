import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import SearchHistoryRepository from "../../../../application/repositories/user/implements/searchHistoryRepository";
import Remove from "../../../../application/useCases/user/search/remove";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class RemoveController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { _id } = req.params;
    const { userId } = req.user;

    const remove = new Remove(new SearchHistoryRepository());

    try {
      const removeId = await remove.execute(userId, _id);
      res.status(HttpStatusCode.OK).json(removeId);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
