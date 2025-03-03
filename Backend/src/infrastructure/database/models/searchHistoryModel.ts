import mongoose, { Schema, Document } from "mongoose";

export interface ISearchHistory extends Document {
  _id: string;
  userId: string;
  history: string[];
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
      default: []
    }
  },
  {
    timestamps: true,
  }
);

searchHistorySchema.pre<ISearchHistory>("save", function (next) {
  if (this.history.length > 10) {
    this.history = this.history.slice(-10);
  }
  next();
});

const SearchHistoryModel = mongoose.model<ISearchHistory>("SearchHistory", searchHistorySchema);

export default SearchHistoryModel;
