export interface GetUserData {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | File;
  gender: string;
  dateOfBirth: string;
  bio: string;
  isPrivateAccount: boolean;
}

export interface GetUserDataPostDetials {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | File;
  gender: string;
  dateOfBirth: string;
  bio: string;
  isPrivateAccount: boolean;
  followings: string[];
  followers: string[];
  blockerUser: string[];
}

interface CustomFilter {
  contrast: number;
  brightness: number;
  saturation: number;
  sepia: number;
  grayScale: number;
}

export interface PostData {
  url: string;
  type: string;
  filterClass: string;
  customFilter: CustomFilter;
  tagUsers: string[];
  isSensitive: boolean;
  sensitiveContentType: unknown;
}

export interface GetUserPostData {
  _id: string;
  userId: string;
  post: PostData[];
  caption: string;
  aspectRatio: string;
  hideLikeAndView: boolean;
  hideComment: boolean;
  likeCount: number;
  commentCount: number;
}
