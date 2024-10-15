export interface GetUserData {
  _id: string;
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
  userId: GetUserData;
  post: PostData[];
  caption: string;
  aspectRatio: string;
  hideLikeAndView: boolean;
  hideComment: boolean;
  musicId: string;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

export interface PostModalProps {
  post: GetUserPostData[];
  imageIndex: number;
  close: () => void;
}

export interface PostActionModalProps {
  openActionModal: boolean;
  handleModalOpenAndClose: (status: boolean) => void;
  postUserId: string;
  postId: string;
  handleDeletePostData: () => void;
}

export interface PostEditModalProps {
  openEditModal: boolean;
  handleEditModalOpenAndClose: (status: boolean) => void;
  postId: string;
  handleEditAndDelete: () => void;
}

export interface PostShareModalProps {
  openShareModal: boolean;
  handleShareModalOpenAndClose: (status: boolean) => void;
}

export interface ProifilePostSectionProps {
  fetchPostDetialData: () => void;
}

export interface PostUpdateFormData {
  caption: string;
  hideLikeAndViewCount: string;
  turnOffCounting: string;
}
