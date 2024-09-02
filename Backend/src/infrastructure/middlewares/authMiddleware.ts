import { Request, Response, NextFunction } from "express";
import TokenManager from "../../application/providers/tokenManager";

const tokenManager = new TokenManager();

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
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
    const decoded = tokenManager.verifyRefreshToken(token);
    req.user = decoded;
    if (req.user.role == "user") {
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
