import { GetUserDataForPost, PostData } from "../profile/profile";

interface PostItem {
  url: string;
  type: string;
  filterClass: string;
  customFilter: [
    {
      label: "Contrast";
      value: 100;
      field: "contrast";
    },
    {
      label: "Brightness";
      value: 100;
      field: "brightness";
    },
    {
      label: "Saturation";
      value: 100;
      field: "saturate";
    },
    { label: "Sepia"; value: 0; field: "sepia" },
    { label: "Gray Scale"; value: 0; field: "gray" }
  ];
  tagUsers: string[];
}

export interface IPostWithUserData {
  _id: string;
  userId: GetUserDataForPost;
  post: PostData[];
  caption: string;
  musicId: string;
  aspectRatio: string;
  hideLikeAndView: boolean;
  hideComment: boolean;
  likeCount: number;
  commentCount: number;
  isArchive: boolean;
  createdAt: Date;
  isLiked: boolean;
  reportDetials: {
    userId: string,
    reportReason: string,
  }[]
}

interface CustomFilter {
  label: string;
  value: number;
  field: string;
}

export interface UserStory {
  _id: string;
  userId: string;
  story: {
    url: string | object;
    type: string;
    filterClass: string;
    customFilter: CustomFilter[];
  };
  musicId: string;
  seenBy: string[];
  createdAt: Date;
}

export interface StoriesWithCurrentUserAndFollowUsers {
  userStories: StoriesWithUserData
  followingsStories: StoriesWithUserData[]
}

export interface StoriesWithUserData {
  userData: GetUserDataForPost
  userStory: UserStory[]
}

export interface PostState {
  post: PostItem[];
  postIndex: number;
  aspectRatio: number | null;
  musicId: string;
  postHoverFilterClass: string;
  postType: string;
  reels: IPostWithUserData[];
  reelTotalPage: number;
  isStory: boolean;
  storyType: string
}

export interface GetCreatePostMusicData {
  _id: string;
  title: string;
  music: string;
  image: string;
}

export interface GetSelectMusicData {
  _id: string;
  title: string;
  music: string;
  image: string;
}

export interface GetCreatePostUserData {
  _id: string;
  fullname: string;
  username: string;
  profilePicture: string;
}
