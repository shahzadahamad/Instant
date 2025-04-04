import { ISubscription } from "../../../../infrastructure/database/models/subscription";
import SubscriptionRepository from "../../../repositories/admin/subscriptionRepository";

export default class CreateSubscription {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  public async execute(period: string, price: number, offer: number): Promise<ISubscription> {

    if (!period) {
      throw new Error("period is required.");
    }

    if (!price) {
      throw new Error("price is required.");
    }

    return await this.subscriptionRepository.create(period, price, offer);

  }
}
