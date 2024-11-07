import { Request, Response } from "express";
import AdminRepository from "../../../../application/repositories/admin/adminRepository";
import EditAdmin from "../../../../application/useCases/admin/admin/editAdmin";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";

export default class EditAdminController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { username, email } = req.body;
    const { userId } = req.user;
    const file = req.file;

    const editAdmin = new EditAdmin(new AdminRepository(), new AwsS3Storage());

    try {
      const adminData = await editAdmin.execute(userId, username, email, file);

      res.status(200).json(adminData);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
      return;
    }
  }
}
