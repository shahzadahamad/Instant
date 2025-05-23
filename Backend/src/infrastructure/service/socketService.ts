import { Server as SocketIOServer, Socket } from "socket.io";
import socketAuthMiddleware from "../middlewares/socketAuthMiddleware";
import { IPost } from "../database/models/postModel";
import ChatRepository from "../../application/repositories/user/implements/chatRepository";
import MessageRepository from "../../application/repositories/user/implements/messageRepository";
import sendMessage from "../../application/useCases/user/chat/sendMessage";
import { IMessage } from "../database/models/messageModal";
import UserRepository from "../../application/repositories/user/implements/userRepository";
import ChangeOnlineStatus from "../../application/useCases/user/user/changeOnlineStatus";
import { IUser } from "../database/models/userModel";
import SendShareMessaege from "../../application/useCases/user/chat/sendShareMessaege";
import PostRepository from "../../application/repositories/user/implements/postRepository";
import { IStory } from "../database/models/storyModal";
import ChatById from "../../application/useCases/user/chat/chatById";

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
        const { chatId, message, type } = data;
        const userId = socket.data.user.userId;
        const sendMessaege = new sendMessage(new ChatRepository(), new MessageRepository(), new UserRepository());
        await sendMessaege.execute(chatId, userId, message, type);
      });

      socket.on("send_share_message", async (data) => {
        const { chatIds, postId } = data;
        const userId = socket.data.user.userId;
        const sendShareMessaege = new SendShareMessaege(new ChatRepository(), new MessageRepository(), new UserRepository(), new PostRepository());
        await sendShareMessaege.execute(userId, chatIds, postId);
      });

      socket.emit("me", socket.id);

      socket.on('callUser', async (data) => {
        const socketId = this.userSocketMap.get(data.userId);
        const userId = socket.data.user.userId;
        const sendMessaege = new sendMessage(new ChatRepository(), new MessageRepository(), new UserRepository());
        await sendMessaege.execute(data.userId, userId, `${userId} started a ${data.isVideo ? 'video' : "audio"} call`, 'callText');
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

      socket.on('endCall', async (data) => {
        const socketId = this.userSocketMap.get(data.userId);
        const userId = socket.data.user.userId;
        const sendMessaege = new sendMessage(new ChatRepository(), new MessageRepository(), new UserRepository());
        await sendMessaege.execute(data.userId, userId, `${data.isVideo ? "Video chat ended" : "Audio call ended"}`, 'callText');
        if (socketId) {
          this.io.to(socketId).emit('endCall', { userId: userId });
        }
      });

      socket.on('callGroup', async (data) => {
        // const userId = socket.data.user.userId;
        // const sendMessaege = new sendMessage(new ChatRepository(), new MessageRepository(), new UserRepository());
        // await sendMessaege.execute(data.chatId, userId, `${userId} started a ${data.isVideo ? 'video' : "audio"} call`, 'callText');
        const groupData = new ChatById(new ChatRepository());
        const groupMember = await groupData.execute(data.chatId);
        if (groupMember) {
          groupMember.members.forEach((userId: string) => {
            const socketId = this.userSocketMap.get(userId);
            if (socketId && (userId.toString() !== socket.data.user.userId.toString())) {
              this.io.to(socketId).emit('callGroup', { chatId: data.chatId, isVideo: data.isVideo });
            }
          });
        }
      });

      socket.on('endCallGroup', async (data) => {
        // const userId = socket.data.user.userId;
        // const sendMessaege = new sendMessage(new ChatRepository(), new MessageRepository(), new UserRepository());
        // await sendMessaege.execute(data.chatId, userId, `${data.isVideo ? "Video chat ended" : "Audio call ended"}`, 'callText');
        const groupData = new ChatById(new ChatRepository());
        const groupMember = await groupData.execute(data.chatId);
        if (groupMember) {
          groupMember.members.forEach((userId: string) => {
            const socketId = this.userSocketMap.get(userId);
            if (socketId && (userId.toString() !== socket.data.user.userId.toString())) {
              this.io.to(socketId).emit('endCallGroup', { userId: userId });
            }
          });
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

  public sendNewStory(userId: string, storyData: IStory, message: string): void {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("newStory", { storyData, message });
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

  public sendMessage(userId: string, messageData: IMessage[], lastMessage: { fromId: Partial<IUser>, message: string }): void {
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