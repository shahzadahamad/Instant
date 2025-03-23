import { IPost } from "../../../../infrastructure/database/models/postModel";
import AwsS3Storage from "../../../providers/awsS3Storage";
import FriendsRepository from "../../../repositories/user/friendsRepository";
import PostRepository from "../../../repositories/user/postRepository";
import UserRepository from "../../../repositories/user/userRepository";

export default class UserPostData {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private friendsRepository: FriendsRepository;
  private awsS3Storage: AwsS3Storage;

  constructor(postRepository: PostRepository, userRepository: UserRepository, friendsRepository: FriendsRepository, awsS3Storage: AwsS3Storage) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.friendsRepository = friendsRepository;
    this.awsS3Storage = awsS3Storage;
  }

  public async execute(id: string, username: string): Promise<IPost[]> {
    if (username) {
      const user = await this.userRepository.findByUsername(username);
      if (user) {
        const isFriend = await this.friendsRepository.isAlreadyFollowing(id, user._id.toString());

        if (user.isPrivateAccount && !isFriend) {
          return [];
        }
        const postData = await this.postRepository.findUserPostData(user._id);
        for (const post of postData) {
          for (const postUrl of post.post) {
            if (postUrl.url) {
              postUrl.url = await this.awsS3Storage.getSignedUrl(postUrl.url as string);
            }
          }
        }
        return postData;
      }
    }

    const postData = await this.postRepository.findUserPostData(id);
    for (const post of postData) {
      for (const postUrl of post.post) {
        if (postUrl.url) {
          postUrl.url = await this.awsS3Storage.getSignedUrl(postUrl.url as string);
        }
      }
    }
    return postData;
  }
}
