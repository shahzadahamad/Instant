import { UpdateWriteOpResult } from "mongoose";
import { IUser } from "../../../../infrastructure/database/models/userModel";
import { QueryType, QueryTypeGetUserDataAdin } from "../../../interface/post";

export interface IUserRepository {
  findById(_id: string): Promise<IUser | null>;
  findById1(_id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsernameAndEmail(usernameOrEmail: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findByUsernameEdit(username: string, userId: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  findUsersByUserIds(userIds: string[]): Promise<IUser[]>;
  userPasswordChange(userId: string, password: string): Promise<UpdateWriteOpResult>;
  updateUser(userId: string, fullname: string, username: string, email: string, phoneNumber: string, gender: string, dateOfBirth: string, isPrivateAccount: boolean, bio: string, fileUrl?: string): Promise<IUser | null>;
  getUserData(startIndex: number, limit: number, query: QueryTypeGetUserDataAdin): Promise<{ users: IUser[]; totalPages: number; totalUser: number }>;
  blockAndUnBlockUser(_id: string, status: boolean): void;
  find10UserBySearch(query: QueryType): Promise<IUser[]>;
  findUsers(data: string[]): Promise<IUser[]>;
  findUserDataWithIdInArray(data: string[]): Promise<IUser[]>;
  changeUserOnlineStatus(userId: string, isOnline: boolean): Promise<UpdateWriteOpResult>;
  updateVerification(userId: string, period: string, status: boolean, paymentId: string): Promise<UpdateWriteOpResult>;
  setVerificationStatusFalse(userId: string): Promise<UpdateWriteOpResult>;
  findSearchUsers(userId: string, search: string): Promise<IUser[]>;
  findUsersByIds(userIds: string[], limit: number): Promise<IUser[]>;
}