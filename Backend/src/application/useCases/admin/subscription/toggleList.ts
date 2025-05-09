import { MESSAGES } from "../../../../infrastructure/constants/messages";
import SubscriptionRepository from "../../../repositories/admin/implements/subscriptionRepository";

export default class ToggleList {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  public async execute(id: string, status: string): Promise<string> {
    if (status === "list") {
      await this.subscriptionRepository.listAndUnlist(id, true);
    } else if (status === "unlist") {
      await this.subscriptionRepository.listAndUnlist(id, false);
    } else {
      throw new Error(MESSAGES.ERROR.INVALID_ACTION);
    }
    return MESSAGES.SUCCESS.ACTION_SUCCESS;
  }
}
