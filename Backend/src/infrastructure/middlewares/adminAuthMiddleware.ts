import { Response, NextFunction, Request } from "express";
import TokenManager from "../../application/providers/tokenManager";
import { HttpStatusCode, UserRole } from "../enums/enums";
import { MESSAGES } from "../constants/messages";

const tokenManager = new TokenManager();

const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: MESSAGES.ERROR.NO_TOKEN_PROVIDED });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: MESSAGES.ERROR.TOKEN_ERROR });
    return;
  }

  const token = parts[1];
  try {
    const decoded = tokenManager.verifyAccessToken(token);
    req.user = decoded as { userId: string, role: string };
    if (req.user.role == UserRole.ADMIN) {
      next();
    } else {
      res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: MESSAGES.ERROR.OPERATION_NOT_AUTHORIZED });
      return;
    }
  } catch (error) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ message: MESSAGES.ERROR.INVALID_TOKEN, error });
    return;
  }
};

export default adminAuthMiddleware;
