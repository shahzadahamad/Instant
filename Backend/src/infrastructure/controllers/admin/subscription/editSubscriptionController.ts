import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import SubscriptionRepository from "../../../../application/repositories/admin/subscriptionRepository";
import EditSubscription from "../../../../application/useCases/admin/subscription/editSubscription";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class EditSubscriptionController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { _id } = req.params;
    const { period, price, offer } = req.body;
    const editSubscription = new EditSubscription(new SubscriptionRepository());

    try {
      const data = await editSubscription.execute(_id, period, price, offer);
      res.status(HttpStatusCode.OK).json({ message: MESSAGES.SUCCESS.SUBSCRIPTION_UPDATED, data });
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
