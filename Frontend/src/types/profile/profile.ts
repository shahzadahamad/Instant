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
