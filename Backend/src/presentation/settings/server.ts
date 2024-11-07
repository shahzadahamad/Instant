import express from "express";
import authRouter from "../routes/user/auth";
import cors from "cors";
import connectDb from "../../infrastructure/configs/dbConfig";
import cookieParser from "cookie-parser";
import adminAuthRouter from "../routes/admin/auth";
import adminUsersRouter from "../routes/admin/user";
import userRouter from "../routes/user/user";
import musicRouter from "../routes/admin/music";
import userMusicRouter from "../routes/user/music";
import userPostRouter from "../routes/user/post";
import morgan from 'morgan';
import adminRouter from "../routes/admin/admin";

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin", adminRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/music', musicRouter);
app.use('/api/user/music', userMusicRouter);
app.use('/api/user/post', userPostRouter);

const port: number | string = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
  connectDb();
});
