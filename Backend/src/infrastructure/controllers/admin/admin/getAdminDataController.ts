import { Request, Response } from "express";
import AdminRepository from "../../../../application/repositories/admin/adminRepository";
import GetAdminData from "../../../../application/useCases/admin/admin/getAdminData";

export default class GetAdminDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    const getAdminData = new GetAdminData(new AdminRepository());

    try {
      const adminData = await getAdminData.execute(userId);

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
