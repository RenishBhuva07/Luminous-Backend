import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../models/token.service.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const token = authorization.substring(7);

  try {
    const payload = verifyAccessToken(token) as {
      sub?: string;
      type?: string;
    };

    if (payload.type !== "access" || !payload.sub) {
      return response.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    (request as AuthenticatedRequest).userId = payload.sub;

    next();
  } catch {
    return response.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
}
