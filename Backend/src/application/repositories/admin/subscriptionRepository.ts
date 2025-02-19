import SubscriptionModel, { ISubscription } from "../../../infrastructure/database/models/subscription";


export default class SubscriptionRepository {
  public async create(period: string, price: number, offer: number): Promise<ISubscription> {
    const newSubscription = new SubscriptionModel({
      period,
      price,
      offer,
    });
    return await newSubscription.save();
  }

  public async findMusicById(_id: string): Promise<ISubscription | null> {
    try {
      return await SubscriptionModel.findOne({ _id: _id });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find music");
      }
      console.error("Unknown error finding music");
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
      console.error("Unknown error edit music");
      throw new Error("Unknown error");
    }
  }
}
