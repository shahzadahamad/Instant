import SearchHistoryModel, { ISearchHistory } from "../../../infrastructure/database/models/searchHistoryModel";
import { SearchHisotry } from "../../interface/search";

export default class SearchHistoryRepository {
  public async findById(userId: string): Promise<{ history: SearchHisotry[]; userId: string; _id: string } | null> {
    try {
      return await SearchHistoryModel.findOne({ userId }).populate<{ history: SearchHisotry[] }>("history", "_id username profilePicture fullname isOnline isVerified").lean();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding user history: ${error.message}`);
        throw new Error("Failed to find user history");
      }
      console.error("Unknown error finding user history");
      throw new Error("Unknown error");
    }
  }

  public async remove(userId: string, removeId: string): Promise<string> {
    try {
      const result = await SearchHistoryModel.updateOne(
        { userId },
        {
          $pull: { history: removeId },
        }
      );

      if (result.modifiedCount > 0) {
        return removeId;
      } else {
        return "";
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding user history: ${error.message}`);
        throw new Error("Failed to find user history");
      }
      console.error("Unknown error finding user history");
      throw new Error("Unknown error");
    }
  }

  public async removeAll(userId: string): Promise<void> {
    try {
      await SearchHistoryModel.updateOne(
        { userId },
        {
          $set: { history: [] },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding user history: ${error.message}`);
        throw new Error("Failed to find user history");
      }
      console.error("Unknown error finding user history");
      throw new Error("Unknown error");
    }
  }

  public async create(userId: string, addId: string): Promise<ISearchHistory> {
    try {

      await SearchHistoryModel.updateOne(
        { userId },
        {
          $pull: { history: addId },
        }
      );

      return await SearchHistoryModel.findOneAndUpdate(
        { userId },
        {
          $push: {
            history: {
              $each: [addId],
              $position: 0,
              $slice: 10
            },
          },
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating user history: ${error.message}`);
        throw new Error("Failed to create user history");
      }
      console.error("Unknown error create user history");
      throw new Error("Unknown error");
    }
  }
}
