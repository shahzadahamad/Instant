import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import BlockOrUnblockUserByAdmin from "../../../../application/useCases/admin/user/blockOrUnblockUserByAdmin";

export default class BlockOrUnblockUserAdminController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { id, status } = req.params;
    const blockOrUnblockUserByAdmin = new BlockOrUnblockUserByAdmin(new UserRepository());

    try {
      const actionStatus = await blockOrUnblockUserByAdmin.execute(id, status);
      res.status(200).json(actionStatus);
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
