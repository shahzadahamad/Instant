import { Socket } from "socket.io";
import TokenManager from "../../application/providers/tokenManager";

const tokenManager = new TokenManager();

const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token not provided"));
  }

  try {
    const decoded = tokenManager.verifyAccessToken(token);
    socket.data.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new Error(`Authentication error: Invalid token - ${error.message}`));
    } else {
      next(new Error("Authentication error: Unexpected error during token verification"));
    }
  }
};

export default socketAuthMiddleware;