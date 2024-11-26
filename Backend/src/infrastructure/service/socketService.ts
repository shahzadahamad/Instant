import { Server as SocketIOServer, Socket } from "socket.io";
import socketAuthMiddleware from "../middlewares/socketAuthMiddleware";
import { IPost } from "../database/models/postModel";

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
    this.io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.data.user.userId}`);
      this.userSocketMap.set(socket.data.user.userId, socket.id);

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.data.user.userId}`);
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
}