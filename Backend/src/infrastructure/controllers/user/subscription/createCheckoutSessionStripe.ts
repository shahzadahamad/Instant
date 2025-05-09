import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import CreateCheckoutSession from "../../../../application/useCases/user/subscription/createCheckoutSession";
import UserRepository from "../../../../application/repositories/user/userRepository";
import SubscriptionRepository from "../../../../application/repositories/admin/subscriptionRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class CreateCheckoutSessionStripe implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const plan = req.body;
    const { userId } = req.user;
    const createCheckoutSession = new CreateCheckoutSession(new UserRepository(), new SubscriptionRepository());
    try {
      const sessionId = await createCheckoutSession.execute(plan, userId);
      res.status(HttpStatusCode.OK).json({ id: sessionId });
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
