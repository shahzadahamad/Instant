export interface GetUserDataForAdminDashboard {
  _id: string,
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
