export interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface FollowDeitals {
  follow: boolean,
  request: boolean,
}

export interface UserState {
  currentUser: User | null;
  followDetials: FollowDeitals;
}
