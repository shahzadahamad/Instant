import { Request, Response } from "express";
import UserRepository from "../../../application/repositories/user/userRepository";
import PasswordHasher from "../../../application/providers/passwordHasher";
import CreateUser from "../../../application/useCases/user/createUser";
import OtpRepository from "../../../application/repositories/user/otpRepository";

export default class CreateUserController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { fullname, username, email, password, id, otp } = req.body;

    const createUser = new CreateUser(
      new UserRepository(),
      new OtpRepository(),
      new PasswordHasher()
    );

    try {
      await createUser.execute(fullname, username, email, password, id, otp);

      return res.status(200).json({ message: "Registration successful!" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
