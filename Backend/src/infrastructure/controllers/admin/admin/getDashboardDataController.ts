import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import UserRepository from "../../../../application/repositories/user/userRepository";
import FriendsRepository from "../../../../application/repositories/user/friendsRepository";
import PaymentRepository from "../../../../application/repositories/user/paymentRepository";
import GetDashboardData from "../../../../application/useCases/admin/admin/getDashboardData";
import PostRepository from "../../../../application/repositories/user/postRepository";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetDashboardDataController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {

    const getDashboardData = new GetDashboardData(new PostRepository(), new UserRepository(), new FriendsRepository(), new PaymentRepository());

    try {
      const adminData = await getDashboardData.execute();
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
