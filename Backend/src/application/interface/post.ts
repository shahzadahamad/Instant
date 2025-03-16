import { ContentModerationDetection, ModerationLabel } from "@aws-sdk/client-rekognition";
import { IUser } from "../../infrastructure/database/models/userModel";

interface CustomFilter {
  label: string;
  value: number;
  field: string;
}

export interface PostData {
  url: string | object;
  type: string;
  filterClass: string;
  customFilter: CustomFilter[];
  tagUsers: string[];
  isSensitive: boolean;
  sensitiveContentType: ModerationLabel[] | ContentModerationDetection[];
}

export interface StoryData {
  url: string | object;
  type: string;
  filterClass: string;
  customFilter: CustomFilter[];
}

export interface StoryData {
  url: string | object;
  type: string;
  filterClass: string;
  customFilter: CustomFilter[];
}

export type QueryType = {
  $and: Array<
    | {
      $or: Array<{
        username?: { $regex: RegExp };
        fullname?: { $regex: RegExp };
      }>;
    }
    | {
      _id: { $nin: string[] };
    }
  >;
};


export type QueryTypeGetUserDataAdin = {
  $or?: Array<{
    fullname?: { $regex: RegExp };
    username?: { $regex: RegExp };
    email?: { $regex: RegExp };
    phoneNumber?: { $regex: RegExp };
  }>;
};

export type QueryTypeGetSubscriptionDataAdmin = {
  $or?: Array<{
    period?: { $regex: RegExp };
    price?: { $regex: RegExp } | { $eq: number } | { $gte: number } | { $lte: number };
    offer?: { $regex: RegExp } | { $eq: number } | { $gte: number } | { $lte: number };
  }>;
};

export interface PostFilter {
  isArchive: boolean;
  userId?: { $in: string[] } | { $nin: string[] };
  _id?: { $nin: string[] } | { $in: string[] }
  ["post.0.type"]?: string;
}

export interface IPostWithUserData {
  _id: string;
  userId: IUser;
  post: PostData[];
  caption: string;
  musicId: string;
  aspectRatio: string;
  hideLikeAndView: boolean;
  hideComment: boolean;
  likeCount: number;
  commentCount: number;
  isArchive: boolean;
}

export interface IFriendsWithUserData {
  userId: IUser,
  followers: string[];
  followings: string[];
  blockedUser: string[];
}

export interface IFriendsWithUserFollowingData {
  userId: string,
  followers: IUser[];
  followings: IUser[];
  blockedUser: string[];
}

export interface IpostWithUserData {
  _id: string;
  userId: IUser;
  post: PostData[];
  caption: string;
  musicId: string;
  aspectRatio: string;
  hideLikeAndView: boolean;
  hideComment: boolean;
  likeCount: number;
  commentCount: number;
  isArchive: boolean;
}