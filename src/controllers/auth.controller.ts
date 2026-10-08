import type { Request, Response } from "express";

import {
  registerSchema,
  loginSchema,
  completeProfileSchema,
  refreshTokenSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "../schemas/auth.schema.js";

import {
  registerUser,
  loginUser,
  completeProfile,
  getUserProfile,
  refreshAccessToken,
  logoutUser,
  changePassword,
  deleteAccount,
  getActiveSessions,
  revokeSession,
} from "../services/auth/auth.service.js";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

// Register
export async function register(request: Request, response: Response) {
  const input = registerSchema.parse(request.body);

  const result = await registerUser(input);

  return response.status(201).json({
    success: true,
    data: result,
  });
}

// Login
export async function login(request: Request, response: Response) {
  const input = loginSchema.parse(request.body);

  const result = await loginUser(input);

  return response.status(200).json({
    success: true,
    data: result,
  });
}

// Refresh Token
export async function refresh(request: Request, response: Response) {
  const input = refreshTokenSchema.parse(request.body);

  const result = await refreshAccessToken(input.refreshToken);

  return response.status(200).json({
    success: true,
    data: result,
  });
}

// Logout
export async function logout(request: Request, response: Response) {
  const input = refreshTokenSchema.parse(request.body);

  const result = await logoutUser(input.refreshToken);

  return response.status(200).json({
    success: true,
    data: result,
  });
}

// Complete Profile
export async function completeUserProfile(
  request: Request,
  response: Response,
) {
  const input = completeProfileSchema.parse(request.body);

  const userId = (request as AuthenticatedRequest).userId;

  if (!userId) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const user = await completeProfile(userId, input as any);

  return response.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
}

// Get Profile
export async function getProfile(request: Request, response: Response) {
  const userId = (request as AuthenticatedRequest).userId;

  if (!userId) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const user = await getUserProfile(userId);

  return response.status(200).json({
    success: true,
    data: {
      user,
    },
  });
}

// Change Password
export async function changeUserPassword(request: Request, response: Response) {
  const input = changePasswordSchema.parse(request.body);

  const userId = (request as AuthenticatedRequest).userId;

  if (!userId) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const result = await changePassword(
    userId,
    input.currentPassword,
    input.newPassword,
  );

  return response.status(200).json({
    success: true,
    data: result,
  });
}

// Delete Account
export async function deleteUserAccount(request: Request, response: Response) {
  const input = deleteAccountSchema.parse(request.body);

  const userId = (request as AuthenticatedRequest).userId;

  if (!userId) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const result = await deleteAccount(userId, input.password, input.reason);

  return response.status(200).json({
    success: true,
    data: result,
  });
}

// Get Sessions
export async function getSessions(request: Request, response: Response) {
  const userId = (request as AuthenticatedRequest).userId;

  if (!userId) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const sessionId = (request as AuthenticatedRequest).sessionId;

  const sessions = await getActiveSessions(userId, sessionId);

  return response.status(200).json({
    success: true,
    data: {
      sessions,
    },
  });
}

// Revoke Session
export async function revokeUserSession(request: Request, response: Response) {
  const userId = (request as AuthenticatedRequest).userId;
  const sessionId = request.params.id;

  if (!userId) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
  
  if (!sessionId) {
    return response.status(400).json({
      success: false,
      message: "Session ID is required",
    });
  }

  const result = await revokeSession(userId, sessionId);

  return response.status(200).json({
    success: true,
    data: result,
  });
}
