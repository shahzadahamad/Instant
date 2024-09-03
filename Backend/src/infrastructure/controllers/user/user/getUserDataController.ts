import { Request, Response } from "express";
import CreateUser from "../../../../application/useCases/user/authentication/createUser";
import UserRepository from "../../../../application/repositories/user/userRepository";
import OtpRepository from "../../../../application/repositories/user/otpRepository";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import GetUserData from "../../../../application/useCases/user/user/getUserData";

export default class GetUserDataController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { _id } = req.params;

    const getUserData = new GetUserData(new UserRepository());

    try {
      const userData = await getUserData.execute(_id);

      return res.status(200).json(userData);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
