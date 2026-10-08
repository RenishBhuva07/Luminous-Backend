import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../services/auth/token.service.js";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  sessionId?: string;
}

export async function authMiddleware(
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
      iat?: number;
      sessionId?: string;
    };

    if (payload.type !== "access" || !payload.sub) {
      return response.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    const user = await User.findById(payload.sub).select(
      "+sessionInvalidatedAt",
    );

    if (!user) {
      return response.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.sessionInvalidatedAt && payload.iat) {
      const changedTimestamp = parseInt(
        (user.sessionInvalidatedAt.getTime() / 1000).toString(),
        10,
      );
      if (payload.iat < changedTimestamp) {
        return response.status(401).json({
          success: false,
          message:
            "Session expired. You logged in on another device or changed your password.",
        });
      }
    }

    if (payload.sessionId) {
      const session = await Session.findById(payload.sessionId);
      if (!session) {
        return response.status(401).json({
          success: false,
          message: "Session terminated. Please login again.",
        });
      }
      (request as AuthenticatedRequest).sessionId = payload.sessionId;
    }

    (request as AuthenticatedRequest).userId = payload.sub;

    next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
}
