import { MESSAGES } from "../../../../infrastructure/constants/messages";
import PostRepository from "../../../repositories/user/postRepository";

export default class Archive {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  };

  public async execute(postId: string): Promise<string> {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error(MESSAGES.ERROR.POST_NOT_FOUND);
    }

    const archive = await this.postRepository.archiveToggle(postId);

    if (archive && archive.isArchive) {
      return MESSAGES.SUCCESS.POST_ARCHIVED;
    } else {
      return MESSAGES.SUCCESS.POST_UNARCHIVED;
    }

  }
}
