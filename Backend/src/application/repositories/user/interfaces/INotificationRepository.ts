import { INotification } from "../../../../infrastructure/database/models/notificationModal"

export interface INotificationRepository {
  send(from: string, to: string, message: string, type: string, relation: string): Promise<INotification>;
  sendPostNotification(from: string, to: string, postId: string, message: string, type: string, relation: string): Promise<INotification>;
  sendPostCommentNotification(from: string, to: string, postId: string, commentId: string, message: string, type: string, relation: string): Promise<INotification>;
  removeCommentNotificationByCommentId(commentId: string): Promise<void>;
  removePostNotification(from: string, to: string, postId: string, message: string, type: string, relation: string): Promise<void>;
  removePostNotificationByPostId(postId: string): Promise<void>;
  unReadNotificationCount(userId: string): Promise<number>;
  findAllById(userId: string): Promise<INotification[]>;
  makeNotificationAsRead(userId: string): Promise<void>;
  editAllNotificationOfRelationFollow(userId: string, fromId: string, type: string, relation: string): Promise<void>;
  editMessageByIds(userId: string, fromId: string, type: string, message: string): Promise<void>;
  removeNotificationByIds(userId: string, fromId: string, type: string): Promise<void>;
  removeAllNotificationOfSingleUser(userId: string, fromId: string, relation: string): Promise<void>;
  removeNotificationOfUserByMessage(userId: string, fromId: string, message: string): Promise<void>;
}