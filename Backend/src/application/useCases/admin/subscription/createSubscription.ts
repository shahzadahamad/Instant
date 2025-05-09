import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { ISubscription } from "../../../../infrastructure/database/models/subscription";
import SubscriptionRepository from "../../../repositories/admin/implements/subscriptionRepository";

export default class CreateSubscription {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  public async execute(period: string, price: number, offer: number): Promise<ISubscription> {

    if (!period) {
      throw new Error(MESSAGES.ERROR.PRICE_REQUIRED);
    }

    if (!price) {
      throw new Error(MESSAGES.ERROR.PRICE_REQUIRED);
    }

    return await this.subscriptionRepository.create(period, price, offer);

  }
}
