import { ISubscription } from "../../../../infrastructure/database/models/subscription";
import { QueryTypeGetSubscriptionDataAdmin } from "../../../interface/post";

export interface ISubscriptionRepository {
  create(period: string, price: number, offer: number): Promise<ISubscription>;
  findSubcriptionById(_id: string): Promise<ISubscription | null>;
  findListedSubscriptionData(): Promise<ISubscription[]>;
  edit(_id: string, period: string, price: number, offer: number): Promise<ISubscription | null>;
  findSubscriptionData(startIndex: number, limit: number, query: QueryTypeGetSubscriptionDataAdmin): Promise<{ subscription: ISubscription[]; totalPages: number; totalSubscription: number }>;
  listAndUnlist(_id: string, status: boolean): void;
}