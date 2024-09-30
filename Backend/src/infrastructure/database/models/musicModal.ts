import mongoose, { Schema, Document } from "mongoose";

export interface IMusic extends Document {
  _id: string;
  title: string;
  image: string;
  music: string;
}

const musicSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    music: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MusicModel = mongoose.model<IMusic>("Music", musicSchema);

export default MusicModel;
