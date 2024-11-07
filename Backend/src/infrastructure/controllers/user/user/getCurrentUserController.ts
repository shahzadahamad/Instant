import { Request, Response } from "express";

export default class GetCurrentUserController {
  public async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    try {
      res.status(200).json(userId);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: "Unknown error" });
    }
  }
}
