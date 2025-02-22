import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import WebHook from "../../../../application/useCases/user/subscription/webHook";
import { stripe } from "../../../configs/stripe";
import PaymentRepository from "../../../../application/repositories/user/paymentRepository";

export default class WebHookController {
  public async handle(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature'] as string;

    const webHook = new WebHook(new UserRepository(), new PaymentRepository());

    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRECT_KEY!);
    try {
      if (event) {
        await webHook.execute(event);
        res.json({ received: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        console.log(error.message);
        return;
      }
      console.log(error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}