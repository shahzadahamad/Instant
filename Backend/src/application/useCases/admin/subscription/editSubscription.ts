import { ISubscription } from "../../../../infrastructure/database/models/subscription";
import SubscriptionRepository from "../../../repositories/admin/subscriptionRepository";

export default class EditSubscription {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  public async execute(_id: string, period: string, price: number, offer: number): Promise<ISubscription> {

    const subscription = await this.subscriptionRepository.findSubcriptionById(_id);

    if (!subscription) {
      throw new Error("subscription not found!");
    }

    if (!period) {
      throw new Error("period is required.");
    }

    if (!price) {
      throw new Error("price is required.");
    }

    const updateSubscription = await this.subscriptionRepository.edit(_id, period, price, offer);

    if (!updateSubscription) {
      throw new Error("subscription not found");
    }

    return updateSubscription;

  }
}
