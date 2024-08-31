import jwt from "jsonwebtoken";

export default class TokenManager {
  public generateAccessToken(payload: {
    userId: string;
    role: string;
  }): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
  }

  public generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }

  public generatePasswordResetToken(userId: string, password: string) {
    const secret = process.env.JWT_SECRET + password;
    return jwt.sign({ userId }, secret!, { expiresIn: "10m" });
  }

  public verifyAccessToken(token: string): string | object {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }

  public verifyRefreshToken(token: string): string | object {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  }

  public verifyPasswordResetToken(
    token: string,
    password: string
  ): string | object {
    const secret = process.env.JWT_SECRET + password;
    return jwt.verify(token, secret);
  }
}
