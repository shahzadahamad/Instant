import { Request, Response } from "express";
import { HttpStatusCode } from "../../../enums/enums";
import { MESSAGES } from "../../../constants/messages";
import PostRepository from "../../../../application/repositories/user/postRepository";
import GetPostDataAdmin from "../../../../application/useCases/admin/post/getPostDataAdmin";
import { IControllerHandler } from "../../interfaces/IControllerHandler";

export default class GetPostDataAdminController implements IControllerHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const { page, search = "", limit } = req.query;
    const pageNumber = parseInt(page as string);
    const parsedLimit = parseFloat(limit as string);

    const getPostDataAdmin = new GetPostDataAdmin(new PostRepository());

    try {
      const userData = await getPostDataAdmin.execute(pageNumber, search as string, parsedLimit);
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
