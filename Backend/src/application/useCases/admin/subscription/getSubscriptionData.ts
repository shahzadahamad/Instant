import { ISubscription } from "../../../../infrastructure/database/models/subscription";
import { QueryTypeGetSubscriptionDataAdmin } from "../../../interface/post";
import SubscriptionRepository from "../../../repositories/admin/subscriptionRepository";

export default class GetSubscriptionData {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  public async execute(pageVal: number, search: string, limit: number): Promise<{ subscription: ISubscription[]; totalPages: number; totalSubscription: number }> {
    const page = pageVal || 1;
    const startIndex = (page - 1) * limit;
    let query: QueryTypeGetSubscriptionDataAdmin = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const searchNumber = parseFloat(search);
      query = {
        $or: [
          { period: { $regex: searchRegex } },
          ...(isNaN(searchNumber) ? [] : [{ price: { $eq: searchNumber } }, { offer: { $eq: searchNumber } }]),
        ],
      };
    }
    const subscription = await this.subscriptionRepository.findSubscriptionData(
      startIndex,
      limit,
      query
    );
    return subscription;
  }
}
