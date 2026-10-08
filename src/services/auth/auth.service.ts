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
}

interface LoginInput {
  email: string;
  password: string;
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

  const accessToken = createAccessToken(user.id);

  const refreshToken = createRefreshToken();

  await Session.create({
    userId: user._id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: createSessionExpiry(),
  });

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

  const accessToken = createAccessToken(user.id);

  const refreshToken = createRefreshToken();

  await Session.create({
    userId: user._id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: createSessionExpiry(),
  });

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
  const newAccessToken = createAccessToken(session.userId.toString());

  const newRefreshToken = createRefreshToken();

  // Store ONLY the hash of the new refresh token
  session.refreshTokenHash = hashRefreshToken(newRefreshToken);

  // Extend session for another 30 days
  session.expiresAt = createSessionExpiry();

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
