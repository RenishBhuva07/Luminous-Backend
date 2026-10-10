import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

export function createAccessToken(userId: string, sessionId?: string): string {
  return jwt.sign(
    {
      sub: userId,
      type: "access",
      ...(sessionId ? { sessionId } : {}),
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any,
    },
  );
}

export function createRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

// OTP
export function createOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// Password reset token
export function createPasswordResetToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function hashPasswordResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
