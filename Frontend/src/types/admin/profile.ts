export interface GetAdminData {
  username: string,
  email: string,
  profilePicture: string,
}

export interface GetAdminFromData {
  username: string,
  email: string,
  profilePicture: string | File,
}