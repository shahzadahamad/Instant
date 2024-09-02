interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface UserState {
  currentUser: User | null;
}
