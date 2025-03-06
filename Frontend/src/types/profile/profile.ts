export interface GetUserData {
  _id?: string;
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

export interface isVerified {
  status: boolean;
  createdAt: Date,
  expireAt: Date;
}

export interface GetUserDataForPost {
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
  isVerified: isVerified;
  isFollowed?: boolean;
}

export interface UserSuggestionData {
  user: GetUserDataForPost,
  mutualFriends: string[],
  isFollow?: boolean,
}

export interface GetUserDataPostDetials {
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
  followings: string[];
  followers: string[];
  blockerUser: string[];
  isVerified: isVerified
}

export interface userData {
  _id: string,
  username: string,
  fullname: string,
  profilePicture: string
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
  userId: GetUserDataForPost;
  post: PostData[];
  caption: string;
  aspectRatio: string;
  hideLikeAndView: boolean;
  hideComment: boolean;
  musicId: string;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  isArchive: boolean
}

export interface PostModalProps {
  post: GetUserPostData[];
  imageIndex: number;
  close: (status?: boolean) => void;
  closeWhileTouchOutsideModal: () => void;
}

export interface PostActionModalProps {
  openActionModal: boolean;
  handleModalOpenAndClose: (status: boolean) => void;
  postUserId: string;
  postId: string;
  handleDeletePostData: () => void;
  postArchived: boolean
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

export interface PostReportModalProps {
  openReportModal: boolean;
  handleReportModalOpenAndClose: (status: boolean) => void;
  postId: string;
}

export interface ProifilePostSectionProps {
  fetchPostDetialData: () => void;
}

export interface PostUpdateFormData {
  caption: string;
  hideLikeAndViewCount: string;
  turnOffCounting: string;
}

interface CommentUserData {
  _id: string;
  username: string;
  profilePicture: string;
  isVerified: isVerified
}

interface Replies {
  _id: string;
  userId: CommentUserData;
  username: string;
  profilePicture: string;
  isVerified: isVerified;
  comment: string;
  createdAt: string;
}

export interface GetComments {
  _id: string;
  postId: string;
  userId: CommentUserData;
  comment: string;
  reply: Replies[];
  createdAt: Date;
}