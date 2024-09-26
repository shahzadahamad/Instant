export interface Admin {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface AdminState {
  currentAdmin: Admin | null;
}
