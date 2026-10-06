import { User } from "../../models/user.model.js";
import { Session } from "../../models/session.model.js";

import { AppError } from "../../utils/app-error.js";
import { hashPassword, verifyPassword } from "../../models/password.service.js";

import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
} from "../../models/token.service.js";

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
    throw new AppError("User not found. Please create a new account.", 404, "USER_NOT_FOUND");
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
