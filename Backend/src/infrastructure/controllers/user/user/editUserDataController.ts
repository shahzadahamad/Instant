import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import UpdateUserData from "../../../../application/useCases/user/user/updateUserData";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";
import UserMoreDataRepository from "../../../../application/repositories/user/userMoreDataRepository";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatusCode } from "../../../enums/enums";
import Sharp from "../../../../application/providers/sharp";

export default class EditUserDataController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;
    const {
      fullname,
      username,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      profilePicture,
      bio,
      isPrivateAccount,
    } = req.body;
    const file = req.file;

    const updateUserData = new UpdateUserData(
      new UserRepository(),
      new AwsS3Storage(),
      new UserMoreDataRepository(),
      new Sharp(),
    );

    try {
      const userData = await updateUserData.execute(
        userId,
        fullname,
        username,
        email,
        phoneNumber,
        gender,
        dateOfBirth,
        profilePicture,
        isPrivateAccount,
        bio,
        file
      );

      res
        .status(HttpStatusCode.OK)
        .json({ message: MESSAGES.SUCCESS.PROFILE_UPDATED, user: userData });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
