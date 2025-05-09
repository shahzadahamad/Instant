import { Request, Response } from "express";

export interface IControllerHandler {
  handle(req: Request, res: Response): Promise<void>;
}