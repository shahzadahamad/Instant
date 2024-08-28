import express, { Request } from "express";
import connectDb from "../../infrastructure/database/connection";
import authRouter from "../routes/auth";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);

const port: number | string = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
  connectDb();
});
