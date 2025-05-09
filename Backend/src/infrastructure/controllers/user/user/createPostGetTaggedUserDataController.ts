import { Request, Response } from "express";
import UserRepository from "../../../../application/repositories/user/userRepository";
import GetCreatePostTaggedUserData from "../../../../application/useCases/user/user/getCreatePostTaggedUserData";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class CreatePostGetTaggedUserDataController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { taggedUsers } = req.query;
    const getCreatePostUserData = new GetCreatePostTaggedUserData(new UserRepository());
    try {
      const userData = await getCreatePostUserData.execute(taggedUsers as string[]);
      res.status(HttpStatusCode.OK).json(userData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        return;
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
    }
  }
}
