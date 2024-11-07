import { Request, Response } from "express";
import AdminRepository from "../../../../application/repositories/admin/adminRepository";
import EditAdminPassword from "../../../../application/useCases/admin/admin/editAdminPassword";
import PasswordHasher from "../../../../application/providers/passwordHasher";

export default class EditAdminPasswordController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.user;

    const editAdminPassword = new EditAdminPassword(new AdminRepository(), new PasswordHasher());

    try {
      const actionStatus = await editAdminPassword.execute(userId, currentPassword, newPassword);

      res.status(200).json({ message: actionStatus });
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
