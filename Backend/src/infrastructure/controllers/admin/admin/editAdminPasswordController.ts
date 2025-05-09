import { Request, Response } from "express";
import AdminRepository from "../../../../application/repositories/admin/implements/adminRepository";
import EditAdminPassword from "../../../../application/useCases/admin/admin/editAdminPassword";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class EditAdminPasswordController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.user;

    const editAdminPassword = new EditAdminPassword(new AdminRepository(), new PasswordHasher());

    try {
      const actionStatus = await editAdminPassword.execute(userId, currentPassword, newPassword);
      res.status(HttpStatusCode.OK).json({ message: actionStatus });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
