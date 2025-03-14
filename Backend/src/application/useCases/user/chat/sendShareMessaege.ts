import ChatRepository from "../../../../application/repositories/user/chatRepository";
import SocketService from "../../../../infrastructure/service/socketService";
import MessageRepository from "../../../repositories/user/messageRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class SendShareMessaege {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private userRepository: UserRepository;
  private postRepository: PostRepository;

  constructor(chatRepository: ChatRepository, messageRepository: MessageRepository, userRepository: UserRepository, postRepository: PostRepository) {
    this.chatRepository = chatRepository;
    this.messageRepository = messageRepository;
    this.userRepository = userRepository;
    this.postRepository = postRepository;
  }

  public async execute(userId: string, chatIds: string[], postId: string): Promise<void> {

    const post = await this.postRepository.findPostByIdWithUserData(postId);

    if (!post || post.userId.isPrivateAccount) {
      throw new Error('Post not found.');
    }

    chatIds.forEach(async (chatId) => {
      const chat = await this.chatRepository.findChatById(chatId, false);
      if (!chat) {
        throw new Error("Chat not found.");
      }

      if (!chat.members.includes(userId)) {
        throw new Error('You are not a member of this chat.');
      }

      const messageData = {
        chatId: chatId,
        type: "sharePost",
        postId: postId,
        senderId: userId,
      };
      const newMessage = await this.messageRepository.createMessage(messageData);

      const lastMessage = 'seat an attachment';
      await this.chatRepository.updateLastMessage(chatId, userId, lastMessage);
      const userData = await this.userRepository.findById(userId);
      const data = {
        _id: userData?._id,
        fullname: userData?.fullname,
        username: userData?.username,
        profilePicture: userData?.profilePicture,
        isOnline: userData?.isOnline
      };
      const updateLastMessage = { fromId: data, message: lastMessage };
      chat.members.forEach((member) => {
        SocketService.getInstance().sendMessage(member, [newMessage], updateLastMessage);
      });

    });
  }
}
