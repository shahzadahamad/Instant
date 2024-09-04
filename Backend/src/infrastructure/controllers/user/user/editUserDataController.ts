import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import UpdateUserData from "../../../../application/useCases/user/user/updateUserData";
import AwsS3Storage from "../../../../application/providers/awsS3Storage";

export default class EditUserDataController {
  public async handle(req: Request, res: Response): Promise<Response | void> {
    const { _id } = req.params;
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
      new AwsS3Storage()
    );

    try {
      const userData = await updateUserData.execute(
        _id,
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

      return res
        .status(200)
        .json({ message: "Profile Updated Successfully!", user: userData });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
