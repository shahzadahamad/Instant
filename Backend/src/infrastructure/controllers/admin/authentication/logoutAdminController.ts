import { Request, Response } from "express";

export default class LogoutAdminController {
  public async handle(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("adminRefreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res.json({ message: "Logged out successfully" });
      return;
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "An error occurred during logout" });
      return;
    }
  }
}
