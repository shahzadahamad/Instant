import { Request, Response } from "express";
import CreateUser from "../../../../application/useCases/user/authentication/createUser";
import UserRepository from "../../../../application/repositories/user/userRepository";
import OtpRepository from "../../../../application/repositories/user/otpRepository";
import PasswordHasher from "../../../../application/providers/passwordHasher";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";


export default class CreateUserController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { fullname, username, email, password, id, otp } = req.body;

    const createUser = new CreateUser(
      new UserRepository(),
      new OtpRepository(),
      new PasswordHasher()
    );

    try {
      await createUser.execute(fullname, username, email, password, id, otp);

      res.status(HttpStatusCode.OK).json({ message: MESSAGES.SUCCESS.REGISTRATION });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
