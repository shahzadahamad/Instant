import { Request, Response } from "express";

export default class GetCurrentUserController {
  public async handle(req: any, res: Response): Promise<Response | void> {
    const { userId } = req.user;

    try {
      return res.status(200).json(userId);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Unknown error" });
    }
  }
}
