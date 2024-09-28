import express from "express";
import authRouter from "../routes/user/auth";
import cors from "cors";
import connectDb from "../../infrastructure/configs/dbConfig";
import userRoute from "../routes/user/user";
import cookieParser from "cookie-parser";
import adminAuthRouter from "../routes/admin/auth";
import adminUsersRouter from "../routes/admin/user";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/admin/auth", adminAuthRouter);
app.use('/api/admin/users', adminUsersRouter); 

const port: number | string = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
  connectDb();
});
