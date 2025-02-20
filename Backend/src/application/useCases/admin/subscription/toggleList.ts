import SubscriptionRepository from "../../../repositories/admin/subscriptionRepository";

export default class ToggleList {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  public async execute(id: string, status: string): Promise<string> {
    if (status === "list") {
      await this.subscriptionRepository.listAndUnlist(id, true)
    } else if (status === "unlist") {
      await this.subscriptionRepository.listAndUnlist(id, false)
    } else {
      throw new Error("Invalid action");
    }
    return "action successfull";
  }
}
