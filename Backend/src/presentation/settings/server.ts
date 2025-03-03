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
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import SocketService from "../../infrastructure/service/socketService";
import chatRouter from "../routes/user/chat";
import adminSubscriptionRouter from "../routes/admin/subscription";
import subscriptionRouter from "../routes/user/subscription";
import webhookRoute from "../routes/user/webhook";
import searchRoute from "../routes/user/search";

const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", 'POST'],
    credentials: true,
  },
});

SocketService.getInstance().setUpIO(io);

//webhook 
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoute);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// User
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use('/api/user/music', userMusicRouter);
app.use('/api/user/post', userPostRouter);
app.use('/api/user/chats', chatRouter);
app.use('/api/user/subscription', subscriptionRouter);
app.use('/api/user/search', searchRoute);

// Admin
app.use("/api/admin", adminRouter);
app.use("/api/admin/auth", adminAuthRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/music', musicRouter);
app.use('/api/admin/subscription', adminSubscriptionRouter);

const port: number | string = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
  connectDb();
});
