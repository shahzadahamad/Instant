import { Request, Response } from "express";
import AdminRepository from "../../../../application/repositories/admin/implements/adminRepository";
import GetAdminData from "../../../../application/useCases/admin/admin/getAdminData";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetAdminDataController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const getAdminData = new GetAdminData(new AdminRepository());

    try {
      const adminData = await getAdminData.execute(userId);
      res.status(HttpStatusCode.OK).json(adminData);
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
