import express from "express";
import authRouter from "../routes/auth";
import cors from "cors";
import connectDb from "../../infrastructure/configs/dbConfig";
import userRoute from "../routes/user";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);

const port: number | string = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
  connectDb();
});
