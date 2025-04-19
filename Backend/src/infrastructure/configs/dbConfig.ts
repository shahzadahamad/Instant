import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb = async (): Promise<void> => {
  try {
    dotenv.config();
    await mongoose.connect(
      process.env.MONGO_URL! || "mongodb://localhost:27017/Instant"
    );
    console.log("Database connected....");
  } catch (error) {
    console.log("Error connecting to mongodb...  :" + error);
    process.exit(1);
  }
};

export default connectDb;
