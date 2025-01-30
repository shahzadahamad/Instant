import { Server as SocketIOServer, Socket } from "socket.io";
import socketAuthMiddleware from "../middlewares/socketAuthMiddleware";
import { IPost } from "../database/models/postModel";
import ChatRepository from "../../application/repositories/user/chatRepository";
import MessageRepository from "../../application/repositories/user/messageRepository";
import sendMessage from "../../application/useCases/user/chat/sendMessage";
import { IMessage } from "../database/models/messageModal";
import UserRepository from "../../application/repositories/user/userRepository";
import ChangeOnlineStatus from "../../application/useCases/user/user/changeOnlineStatus";
import { IUser } from "../database/models/userModel";

export default class SocketService {
  private static instance: SocketService | null = null;
  private io!: SocketIOServer;
  private userSocketMap: Map<string, string> = new Map();

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  setUpIO(io: SocketIOServer) {
    this.io = io;
    this.authenticateSocket();
    this.initialize();
  }

  private authenticateSocket() {
    this.io.use(socketAuthMiddleware);
  }

  public initialize(): void {
    this.io.on("connection", async (socket: Socket) => {
      console.log(`User connected: ${socket.data.user.userId}`);
      this.userSocketMap.set(socket.data.user.userId, socket.id);
      const sendMessaege = new ChangeOnlineStatus(new UserRepository());
      await sendMessaege.execute(socket.data.user.userId, true);
      this.io.emit("online", { userId: socket.data.user.userId });

      socket.on("send_message", async (data) => {
        const { chatId, message } = data;
        const userId = socket.data.user.userId;
        const sendMessaege = new sendMessage(new ChatRepository(), new MessageRepository(), new UserRepository());
        await sendMessaege.execute(chatId, userId, message);
      });

      socket.emit("me", socket.id);

      socket.on('callUser', (data) => {
        const socketId = this.userSocketMap.get(data.userId);
        if (socketId) {
          this.io.to(socketId).emit('callUser', { signal: data.signalData, from: data.from, userId: data._id, isVideo: data.isVideo });
        }
      });

      socket.on('answerCall', (data) => {
        const socketId = this.userSocketMap.get(data.userId);
        if (socketId) {
          this.io.to(socketId).emit('callAccepted', { signal: data.signal, isVideoOff: data.isVideoOff });
        }
      });

      socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.data.user.userId}`);
        const sendMessaege = new ChangeOnlineStatus(new UserRepository());
        await sendMessaege.execute(socket.data.user.userId, false);
        this.io.emit("offline", { userId: socket.data.user.userId });
        this.userSocketMap.delete(socket.data.user.userId);
      });

    });
  }

  public sendNewPost(userId: string, postData: IPost, message: string): void {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("newPost", { postData, message });
    } else {
      console.log(`User ${userId} not connected.`);
    }
  }

  public sendNotification(userId: string): void {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("newNotification");
    } else {
      console.log(`User ${userId} not connected.`);
    }
  }

  public clearNotification(userId: string): void {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("clearNotification");
    } else {
      console.log(`User ${userId} not connected.`);
    }
  }

  public sendMessage(userId: string, messageData: IMessage, lastMessage: { fromId: Partial<IUser>, message: string }): void {
    const socketId = this.userSocketMap.get(userId);
    const data = {
      messageData,
      lastMessage
    };
    if (socketId) {
      this.io.to(socketId).emit("send_message", data);
    } else {
      console.log(`User ${userId} not connected.`);
    }
  }
}