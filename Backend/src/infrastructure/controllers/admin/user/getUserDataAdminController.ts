import { Request, Response } from "express";
import GetUserDataAdmin from "../../../../application/useCases/admin/user/getUserDataAdmin";
import UserRepository from "../../../../application/repositories/user/userRepository";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetUserDataAdminController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { page, search = "", limit } = req.query;
    const pageNumber = parseInt(page as string);
    const parsedLimit = parseFloat(limit as string);

    const getUserData = new GetUserDataAdmin(new UserRepository());

    try {
      const userData = await getUserData.execute(pageNumber, search as string, parsedLimit);
      res.status(HttpStatusCode.OK).json(userData);
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
