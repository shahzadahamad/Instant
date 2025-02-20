import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import SubscriptionRepository from "../../../../application/repositories/admin/subscriptionRepository";
import GetSubscriptionListedData from "../../../../application/useCases/user/subscription/getSubscriptionListedData";

export default class GetSubscriptionListedDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const getSubscriptionListedData = new GetSubscriptionListedData(new SubscriptionRepository());
    try {
      const subscriptionData = await getSubscriptionListedData.execute();
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
