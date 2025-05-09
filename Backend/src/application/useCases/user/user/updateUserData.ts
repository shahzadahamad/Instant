import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IUser } from "../../../../infrastructure/database/models/userModel";
import AwsS3Storage from "../../../providers/awsS3Storage";
import Sharp from "../../../providers/sharp";
import UserMoreDataRepository from "../../../repositories/user/implements/userMoreDataRepository";
import UserRepository from "../../../repositories/user/implements/userRepository";

export default class UpdateUserData {
  private userRepository: UserRepository;
  private awsS3Storage: AwsS3Storage;
  private UserMoreDataRepository: UserMoreDataRepository;
  private sharp: Sharp;

  constructor(userRepository: UserRepository, awsS3Storage: AwsS3Storage, UserMoreDataRepository: UserMoreDataRepository, sharp: Sharp) {
    this.userRepository = userRepository;
    this.awsS3Storage = awsS3Storage;
    this.UserMoreDataRepository = UserMoreDataRepository;
    this.sharp = sharp;
  }

  public async execute(userId: string, fullname: string, username: string, email: string, phoneNumber: string, gender: string, dateOfBirth: string, profilePicture: string, isPrivateAccount: boolean, bio: string, file?: Express.Multer.File): Promise<Partial<IUser>> {
    const user = await this.userRepository.findById(userId);
    const isUsernameExist = await this.userRepository.findByUsernameEdit(username, userId);

    if (isUsernameExist) {
      throw new Error(MESSAGES.ERROR.USERNAME_EXIST);
    }

    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_ACCESS);
    }

    if (email && email !== user.email) {
      throw new Error(MESSAGES.ERROR.CANNOT_CHANGE_EMAIL);
    }

    let fileUrl;
    if (file) {
      const processedBuffer = await this.sharp.makeCircularImage(file.buffer);
      const updatedFile = { ...file, buffer: processedBuffer, };
      await this.awsS3Storage.deleteFile(user.profilePicture);
      fileUrl = await this.awsS3Storage.uploadFile(updatedFile, "profile");
    } else {
      if (
        profilePicture ===
        "https://static.vecteezy.com/system/resources/previews/026/966/960/original/default-avatar-profile-icon-of-social-media-user-vector.jpg"
      ) {
        await this.awsS3Storage.deleteFile(user.profilePicture);
      }
      fileUrl = profilePicture;
    }

    const updatedUser = await this.userRepository.updateUser(userId, fullname, username, email, phoneNumber, gender, dateOfBirth, isPrivateAccount, bio, fileUrl);

    if (!updatedUser?.isPrivateAccount) {
      await this.UserMoreDataRepository.updateFriendRequest(userId);
    }

    if (!updatedUser) {
      throw new Error(MESSAGES.ERROR.CANNOT_UPDATE_USER);
    }

    return { _id: updatedUser._id, fullname: updatedUser.fullname, username: updatedUser.username, email: updatedUser.email, profilePicture: updatedUser.profilePicture, };
  }
}
