import { IPostWithUserData, QueryTypeGetPostDataAdin } from "../../../interface/post";
import PostRepository from "../../../repositories/user/postRepository";

export default class GetPostDataAdmin {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async execute(pageVal: number, search: string, limit: number): Promise<{ posts: IPostWithUserData[]; totalPages: number; totalPost: number }> {
    const page = pageVal || 1;
    const startIndex = (page - 1) * limit;
    let query: QueryTypeGetPostDataAdin = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { caption: { $regex: searchRegex } },
        ],
      };
    }
    const posts = await this.postRepository.getPostData(startIndex, limit, query,);
    return posts;
  }
}
