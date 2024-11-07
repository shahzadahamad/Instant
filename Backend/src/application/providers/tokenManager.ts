import jwt, { JwtPayload } from "jsonwebtoken";

export default class TokenManager {
  public generateAccessToken(payload: {
    userId: string;
    role: string;
  }): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "5m",
    });
  }

  public generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }

  public generatePasswordResetToken(userId: string, password: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET_2! + password, {
      expiresIn: "10m",
    });
  }

  public verifyAccessToken(token: string): string | JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }

  public verifyRefreshToken(token: string): string | object {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  }

  public verifyPasswordResetToken(
    token: string,
    password: string
  ): string | object {
    return jwt.verify(token, process.env.JWT_SECRET_2! + password);
  }
}
