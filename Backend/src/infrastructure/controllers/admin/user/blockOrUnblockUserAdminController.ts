import { Request, Response } from "express";
import GetUserDataAdmin from "../../../../application/useCases/admin/user/getUserDataAdmin";
import UserRepository from "../../../../application/repositories/user/userRepository";
import BlockOrUnblockUserByAdmin from "../../../../application/useCases/admin/user/blockOrUnblockUserByAdmin";

export default class BlockOrUnblockUserAdminController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { id, status } = req.params;
    const blockOrUnblockUserByAdmin = new BlockOrUnblockUserByAdmin(new UserRepository());

    try {
      const actionStatus = await blockOrUnblockUserByAdmin.execute(id,status);
      return res.status(200).json(actionStatus);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
