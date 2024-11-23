import { Request, Response, NextFunction } from "express";
import TokenManager from "../../application/providers/tokenManager";
import VerifyIngUser from "../../application/useCases/user/user/verifyIngUser";
import UserRepository from "../../application/repositories/user/userRepository";
import { HttpStatusCode, UserRole } from "../enums/enums";

const tokenManager = new TokenManager();

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "No token provided" });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Token error" });
    return;
  }

  const token = parts[1];
  try {
    const decoded = tokenManager.verifyAccessToken(token);
    req.user = decoded as { userId: string, role: string };
    if (req.user.role === UserRole.USER) {
      const verifyUser = new VerifyIngUser(new UserRepository());
      const user = await verifyUser.execute(req.user.userId);
      if (!user || user.isBlock) {
        res.status(HttpStatusCode.FORBIDDEN).json({ message: "Your accout is blocked" });
        return;
      }
      next();
    } else {
      res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: "You're not authorised for this operation" });
      return;
    }
  } catch (error) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid token", error });
    return;
  }
};

export default authMiddleware;
