import mongoose, { Schema, Document } from "mongoose";

export interface ISearchHistory<T = string> extends Document {
  _id: string;
  userId: string;
  history: T[]
}

const searchHistorySchema: Schema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    history: {
      type: [String],
      required: true,
      ref: "User",
      default: []
    }
  },
  {
    timestamps: true,
  }
);

const SearchHistoryModel = mongoose.model<ISearchHistory>("SearchHistory", searchHistorySchema);

export default SearchHistoryModel;
