import { Request, Response, NextFunction } from "express";
import TokenManager from "../../application/providers/tokenManager";
import VerifyIngUser from "../../application/useCases/user/user/verifyIngUser";
import UserRepository from "../../application/repositories/user/userRepository";

const tokenManager = new TokenManager();

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Token error" });
  }

  const token = parts[1];
  try {
    const decoded = tokenManager.verifyAccessToken(token);
    req.user = decoded;
    if (req.user.role === "user") {
      const verifyUser = new VerifyIngUser(new UserRepository());
      const user = await verifyUser.execute(req.user.userId);
      if (!user || user.isBlock) {
        return res.status(403).json({ message: "Your accout is blocked" });
      }
      next();
    } else {
      return res
        .status(404)
        .json({ message: "You're not authorised for this operation" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
