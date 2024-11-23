import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import BlockOrUnblockUserByAdmin from "../../../../application/useCases/admin/user/blockOrUnblockUserByAdmin";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";

export default class BlockOrUnblockUserAdminController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { id, status } = req.params;
    const blockOrUnblockUserByAdmin = new BlockOrUnblockUserByAdmin(new UserRepository());

    try {
      const actionStatus = await blockOrUnblockUserByAdmin.execute(id, status);
      res.status(HttpStatusCode.OK).json(actionStatus);
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
