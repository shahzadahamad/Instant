import { ISearchHistory } from "../../../../infrastructure/database/models/searchHistoryModel";
import { SearchHisotry } from "../../../interface/search";

export interface ISearchHistoryRepository {
  findById(userId: string): Promise<{ history: SearchHisotry[]; userId: string; _id: string } | null>;
  remove(userId: string, removeId: string): Promise<string>;
  removeAll(userId: string): Promise<void>;
  create(userId: string, addId: string): Promise<ISearchHistory>;
}