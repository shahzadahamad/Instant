import { ContentModerationDetection, ModerationLabel } from "@aws-sdk/client-rekognition";

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