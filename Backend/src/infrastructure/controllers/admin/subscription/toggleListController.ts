import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import SubscriptionRepository from "../../../../application/repositories/admin/subscriptionRepository";
import ToggleList from "../../../../application/useCases/admin/subscription/toggleList";

export default class ToggleListController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { id, status } = req.params;
    const toggleList = new ToggleList(new SubscriptionRepository());

    try {
      const actionStatus = await toggleList.execute(id, status);
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