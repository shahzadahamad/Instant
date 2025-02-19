import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import SubscriptionRepository from "../../../../application/repositories/admin/subscriptionRepository";
import GetSubscriptionData from "../../../../application/useCases/admin/subscription/getSubscriptionData";

export default class GetSubscriptionDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { page, search = "" } = req.query;
    const pageNumber = parseInt(page as string);

    const getSubscriptionData = new GetSubscriptionData(new SubscriptionRepository());

    try {
      const subscriptionData = await getSubscriptionData.execute(pageNumber, search as string);

      res.status(HttpStatusCode.OK).json(subscriptionData);
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
