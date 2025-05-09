export interface ILikeRepository {
  likeAndDisLikePost(postId: string, userId: string, status: boolean): Promise<void>;
  likeAndDisLikeComment(postId: string, commentId: string, userId: string, status: boolean): Promise<void>;
  hasUserLikedPost(postId: string, userId: string): Promise<boolean>;
  hasUserLikedComment(postId: string, userId: string, commentIds: string[]): Promise<{ [key: string]: { liked: boolean; count: number } }>;
  hasUserLikedPostIds(userId: string, postIds: string[],): Promise<{ [key: string]: boolean }>;
  deletePostlikes(_id: string): void;
  deleteCommentlikes(_id: string): void;
  findLikedPostUser(userId: string): void;
}