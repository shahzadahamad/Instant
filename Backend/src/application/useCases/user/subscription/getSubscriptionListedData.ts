import { ISubscription } from "../../../../infrastructure/database/models/subscription";
import SubscriptionRepository from "../../../repositories/admin/subscriptionRepository";

export default class GetSubscriptionListedData {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  public async execute(): Promise<ISubscription[]> {
    return await this.subscriptionRepository.findListedSubscriptionData();
  }
}
