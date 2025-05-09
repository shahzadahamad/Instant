import { CommentReplyData, IComment } from "../../../../infrastructure/database/models/commentModel";

export interface ICommentRepository {
  createComment(id: string, userId: string, comment: string): Promise<IComment>;
  getComments(id: string): Promise<IComment[]>;
  findCommentById(_id: string): Promise<IComment | null>;
  findCommentReplyById(_id: string): Promise<IComment | null>;
  replytoComment(id: string, userId: string, commentId: string, comment: string, username: string, profilePicture: string): Promise<IComment | null>;
  deletePostComments(_id: string): void;
  deleteComment(_id: string): Promise<void>;
  findcommentOrReplyIdById(_id: string): Promise<IComment | CommentReplyData | null>;
}