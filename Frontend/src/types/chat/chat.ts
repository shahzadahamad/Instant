export interface Member {
  _id: string,
  username: string,
  fullname: string,
  profilePicture: string,
}

export interface ChatData {
  _id:string,
  type: string,
  members: Member[]
  lastMessage: string,
}