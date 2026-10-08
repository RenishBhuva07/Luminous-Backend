import { User } from "../../models/user.model.js";
import { Session } from "../../models/session.model.js";

import { AppError } from "../../utils/app-error.js";
import { hashPassword, verifyPassword } from "../../models/password.service.js";

import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from "./token.service.js";

interface RegisterInput {
  email: string;
  password: string;
  deviceName?: string;
  deviceType?: string;
}

interface LoginInput {
  email: string;
  password: string;
  deviceName?: string;
  deviceType?: string;
}

function createSessionExpiry(): Date {
  const date = new Date();

  date.setDate(date.getDate() + 30);

  return date;
}

interface CompleteProfileInput {
  name: string;
  avatarUrl?: string | null;
}

// REGISTER
export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 409, "USER_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    email,
    passwordHash,
    profileCompleted: false,
  });

  const refreshToken = createRefreshToken();

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    deviceName: input.deviceName || "Unknown Device",
    deviceType: input.deviceType || "Unknown",
    lastActiveAt: new Date(),
    expiresAt: createSessionExpiry(),
  });

  const accessToken = createAccessToken(user.id, session._id.toString());

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      avatarUrl: user.avatarUrl ?? null,
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
    },

    accessToken,

    refreshToken,

    requiresProfileCompletion: true,
  };
}

// LOGIN
export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !user.passwordHash) {
    throw new AppError(
      "User not found. Please create a new account.",
      404,
      "USER_NOT_FOUND",
    );
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);

  if (!isValid) {
    throw new AppError("Incorrect password.", 401, "UNAUTHORIZED");
  }

  const refreshToken = createRefreshToken();

  const deviceName = input.deviceName || "Unknown Device";
  const deviceType = input.deviceType || "Unknown";

  // Prevent duplicate sessions for the same device
  await Session.deleteMany({
    userId: user._id,
    deviceName,
    deviceType,
  });

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    deviceName,
    deviceType,
    lastActiveAt: new Date(),
    expiresAt: createSessionExpiry(),
  });

  const accessToken = createAccessToken(user.id, session._id.toString());

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      avatarUrl: user.avatarUrl ?? null,
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
    },

    accessToken,

    refreshToken,

    requiresProfileCompletion: !user.profileCompleted,
  };
}

export async function completeProfile(
  userId: string,
  input: CompleteProfileInput,
) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        name: input.name.trim(),
        avatarUrl: input.avatarUrl ?? null,
        profileCompleted: true,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
    emailVerified: user.emailVerified,
    profileCompleted: user.profileCompleted,
  };
}

export async function getUserProfile(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    avatarUrl: user.avatarUrl ?? null,
    emailVerified: user.emailVerified,
    profileCompleted: user.profileCompleted,
  };
}

// REFRESH TOKEN
export async function refreshAccessToken(refreshToken: string) {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await Session.findOne({
    refreshTokenHash,
  });

  if (!session) {
    throw new AppError(
      "Invalid or expired refresh token",
      401,
      "INVALID_REFRESH_TOKEN",
    );
  }

  // Extra protection in case MongoDB TTL cleanup hasn't happened yet
  if (session.expiresAt.getTime() <= Date.now()) {
    await Session.deleteOne({ _id: session._id });

    throw new AppError(
      "Refresh token has expired",
      401,
      "REFRESH_TOKEN_EXPIRED",
    );
  }

  // Create new tokens
  const newAccessToken = createAccessToken(
    session.userId.toString(),
    session._id.toString(),
  );

  const newRefreshToken = createRefreshToken();

  // Store ONLY the hash of the new refresh token
  session.refreshTokenHash = hashRefreshToken(newRefreshToken);

  // Extend session for another 30 days
  session.expiresAt = createSessionExpiry();
  session.lastActiveAt = new Date();

  await session.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

// LOGOUT
export async function logoutUser(refreshToken: string) {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  await Session.deleteOne({
    refreshTokenHash,
  });

  return {
    message: "Logged out successfully",
  };
}

// CHANGE PASSWORD
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (!user.passwordHash) {
    throw new AppError(
      "Password authentication is not available for this account",
      400,
      "PASSWORD_NOT_AVAILABLE",
    );
  }

  const isCurrentPasswordValid = await verifyPassword(
    currentPassword,
    user.passwordHash,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError(
      "Current password is incorrect",
      401,
      "INVALID_CURRENT_PASSWORD",
    );
  }

  const isSamePassword = await verifyPassword(newPassword, user.passwordHash);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
      "PASSWORD_SAME_AS_CURRENT",
    );
  }

  const newPasswordHash = await hashPassword(newPassword);

  user.passwordHash = newPasswordHash;
  user.sessionInvalidatedAt = new Date();

  await user.save();

  // Invalidate all refresh-token sessions.
  // User will need to login again on all devices.
  await Session.deleteMany({
    userId: user._id,
  });

  return {
    message: "Password changed successfully",
  };
}

// DELETE ACCOUNT
export async function deleteAccount(
  userId: string,
  password: string,
  reason?: string,
) {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (!user.passwordHash) {
    throw new AppError(
      "Password authentication is not available for this account",
      400,
      "PASSWORD_NOT_AVAILABLE",
    );
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Incorrect password", 401, "INVALID_PASSWORD");
  }

  // Optional:
  // You can store the deletion reason in an analytics/audit
  // collection later if you need it.
  console.log(
    `Account deletion requested for user ${user.id}`,
    reason ? `Reason: ${reason}` : "",
  );

  // Delete all active sessions first
  await Session.deleteMany({
    userId: user._id,
  });

  // Delete the user
  await User.deleteOne({
    _id: user._id,
  });

  return {
    message: "Account deleted successfully",
  };
}

// GET ACTIVE SESSIONS
export async function getActiveSessions(
  userId: string,
  currentSessionId?: string,
) {
  const sessions = await Session.find({ userId })
    .select("_id deviceName deviceType lastActiveAt createdAt")
    .sort({ lastActiveAt: -1 });

  return sessions.map((session) => ({
    id: session._id,
    deviceName: session.deviceName,
    deviceType: session.deviceType,
    lastActiveAt: session.lastActiveAt,
    isCurrentDevice: currentSessionId === session._id.toString(),
  }));
}

// REVOKE SESSION
export async function revokeSession(userId: string, sessionId: string) {
  const result = await Session.deleteOne({
    _id: sessionId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw new AppError(
      "Session not found or already deleted",
      404,
      "SESSION_NOT_FOUND",
    );
  }

  return { message: "Session revoked successfully" };
}
