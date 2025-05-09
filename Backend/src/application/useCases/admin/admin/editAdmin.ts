import { MESSAGES } from "../../../../infrastructure/constants/messages";
import { IAdmin } from "../../../../infrastructure/database/models/adminModel";
import AwsS3Storage from "../../../providers/awsS3Storage";
import AdminRepository from "../../../repositories/admin/implements/adminRepository";

export default class EditAdmin {
  private adminRepository: AdminRepository;
  private awsS3Storage: AwsS3Storage;


  constructor(adminRepository: AdminRepository, awsS3Storage: AwsS3Storage) {
    this.adminRepository = adminRepository;
    this.awsS3Storage = awsS3Storage;
  }

  public async execute(adminId: string, username: string, email: string, file?: Express.Multer.File): Promise<Partial<IAdmin>> {

    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      throw new Error(MESSAGES.ERROR.ADMIN_NOT_FOUND);
    }

    let fileUrl;
    if (file) {
      await this.awsS3Storage.deleteFile(admin.profilePicture);
      fileUrl = await this.awsS3Storage.uploadFile(file, "profile");
    } else {
      fileUrl = admin.profilePicture;
    }

    const updateAdmin = await this.adminRepository.updateAdmin(adminId, username, email, fileUrl);

    if (!updateAdmin) {
      throw new Error(MESSAGES.ERROR.CANNOT_UPDATE_ADMIN);
    }

    return updateAdmin;
  }
}
