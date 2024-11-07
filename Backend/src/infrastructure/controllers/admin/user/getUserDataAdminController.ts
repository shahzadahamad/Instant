import { Request, Response } from "express";
import GetUserDataAdmin from "../../../../application/useCases/admin/user/getUserDataAdmin";
import UserRepository from "../../../../application/repositories/user/userRepository";

export default class GetUserDataAdminController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { page, search = "" } = req.query;
    const pageNumber = parseInt(page as string);

    const getUserData = new GetUserDataAdmin(new UserRepository());

    try {
      const userData = await getUserData.execute(pageNumber, search);

      res.status(200).json(userData);
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
