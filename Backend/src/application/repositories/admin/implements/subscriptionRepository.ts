import SubscriptionModel, { ISubscription } from "../../../../infrastructure/database/models/subscription";
import { QueryTypeGetSubscriptionDataAdmin } from "../../../interface/post";
import { ISubscriptionRepository } from "../interfaces/ISubscriptionRepository";


export default class SubscriptionRepository implements ISubscriptionRepository {
  public async create(period: string, price: number, offer: number): Promise<ISubscription> {
    const newSubscription = new SubscriptionModel({
      period,
      price,
      offer,
    });
    return await newSubscription.save();
  }

  public async findSubcriptionById(_id: string): Promise<ISubscription | null> {
    try {
      return await SubscriptionModel.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find subscription: ${error.message}`);
        throw new Error("Failed to find subscription");
      }
      console.error("Unknown error finding subscription");
      throw new Error("Unknown error");
    }
  }

  public async findListedSubscriptionData(): Promise<ISubscription[]> {
    try {
      return await SubscriptionModel.find({ isListed: true });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find subscription: ${error.message}`);
        throw new Error("Failed to find subscription");
      }
      console.error("Unknown error finding subscription");
      throw new Error("Unknown error");
    }
  }

  public async edit(_id: string, period: string, price: number, offer: number): Promise<ISubscription | null> {
    try {
      return await SubscriptionModel.findOneAndUpdate({ _id: _id }, { $set: { period, price, offer } }, { new: true });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error edit subscription");
      throw new Error("Unknown error");
    }
  }

  public async findSubscriptionData(startIndex: number, limit: number, query: QueryTypeGetSubscriptionDataAdmin): Promise<{ subscription: ISubscription[]; totalPages: number; totalSubscription: number }> {
    try {
      const totalSubscription = await SubscriptionModel.countDocuments();
      const searchTotalSubscription = await SubscriptionModel.countDocuments(query);
      const subscription = await SubscriptionModel.find(query).skip(startIndex).limit(limit).sort({ createdAt: -1 });
      return {
        subscription,
        totalPages: Math.ceil(searchTotalSubscription / limit),
        totalSubscription,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find subscription: ${error.message}`);
        throw new Error("Failed to find subscription");
      }
      console.error("Unknown error finding subscription");
      throw new Error("Unknown error");
    }
  }

  public async listAndUnlist(_id: string, status: boolean) {
    try {
      await SubscriptionModel.updateOne({ _id: _id }, { $set: { isListed: status } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error edit subscription");
      throw new Error("Unknown error");
    }
  }
}
