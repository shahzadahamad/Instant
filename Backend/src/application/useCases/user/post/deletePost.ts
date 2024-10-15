import AwsS3Storage from "../../../providers/awsS3Storage";
import LikeRepository from "../../../repositories/user/likeRepository";
import PostRepository from "../../../repositories/user/postRepository";

export default class DeletePost {
  private postRepository: PostRepository;
  private awsS3Storage: AwsS3Storage;
  private likeRepository: LikeRepository;

  constructor(
    postRepository: PostRepository,
    awsS3Storage: AwsS3Storage,
    likeRepository: LikeRepository
  ) {
    this.postRepository = postRepository;
    this.awsS3Storage = awsS3Storage;
    this.likeRepository = likeRepository;
  }

  public async execute(id: string): Promise<string> {
    const postData = await this.postRepository.findPostById(id);

    if (!postData) {
      throw new Error("Post not found!");
    }

    postData.post.forEach(async (item) => {
      await this.awsS3Storage.deleteFile(item.url.toString());
    });

    await this.postRepository.deletePost(id);
    await this.likeRepository.deletePostlikes(id);
    return "Post deleted successfully.";
  }
}
