import AwsS3Storage from "../../../providers/awsS3Storage";
import LikeRepository from "../../../repositories/user/likeRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class DeletePost {
  private postRepository: PostRepository;
  private awsS3Storage: AwsS3Storage;
  private likeRepository: LikeRepository;
  private userRepository: UserRepository;

  constructor(
    postRepository: PostRepository,
    awsS3Storage: AwsS3Storage,
    likeRepository: LikeRepository,
    userRepository: UserRepository
  ) {
    this.postRepository = postRepository;
    this.awsS3Storage = awsS3Storage;
    this.likeRepository = likeRepository;
    this.userRepository = userRepository;
  }

  public async execute(id: string, userId: string): Promise<string> {
    const postData = await this.postRepository.findPostById(id);
    const userData = await this.userRepository.findById(userId);

    if (!userData) {
      throw new Error("User now found!");
    }

    if (!postData) {
      throw new Error("Post not found!");
    }

    if (userData?._id.toString() !== postData?.userId.toString()) {
      throw new Error("Invalid Action!");
    }

    postData.post.forEach(async (item) => {
      await this.awsS3Storage.deleteFile(item.url.toString());
    });

    await this.postRepository.deletePost(id);
    await this.likeRepository.deletePostlikes(id);
    return "Post deleted successfully.";
  }
}
