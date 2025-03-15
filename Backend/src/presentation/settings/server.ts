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
    origin: process.env.CORS_ORIGIN!,
    methods: ["GET", 'POST'],
    credentials: true,
  },
  pingInterval: 25000,
  pingTimeout: 60000,
});

SocketService.getInstance().setUpIO(io);

//webhook 
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoute);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN!,
    credentials: true,
  })
);

// User
app.use(process.env.API_USER_AUTH!, authRouter);
app.use(process.env.API_USER!, userRouter);
app.use(process.env.API_USER_MUSIC!, userMusicRouter);
app.use(process.env.API_USER_POST!, userPostRouter);
app.use(process.env.API_USER_CHAT!, chatRouter);
app.use(process.env.API_USER_SUBSCRIPITON!, subscriptionRouter);
app.use(process.env.API_USER_SEARCH_HISTORY!, searchRoute);

// Admin
app.use(process.env.API_ADMIN!, adminRouter);
app.use(process.env.API_ADMIN_AUTH!, adminAuthRouter);
app.use(process.env.API_ADMIN_USER!, adminUsersRouter);
app.use(process.env.API_ADMIN_MUSIC!, musicRouter);
app.use(process.env.API_ADMIN_SUBSCRIPITON!, adminSubscriptionRouter);

const port: number | string = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
  connectDb();
});
