import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import SubscriptionRepository from "../../../../application/repositories/admin/subscriptionRepository";
import CreateSubscription from "../../../../application/useCases/admin/subscription/createSubscription";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class CreateSubscriptionController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { period, price, offer } = req.body;
    const createSubscription = new CreateSubscription(new SubscriptionRepository());

    try {
      const data = await createSubscription.execute(period, price, offer);
      res.status(HttpStatusCode.OK).json({ message: MESSAGES.SUCCESS.SUBSCRIPTION_CREATED, data });
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
