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
  });

  return {
    id: user.id,
    email: user.email,
  };
}

// LOGIN
export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !user.passwordHash) {
    throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);

  if (!isValid) {
    throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
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
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
}
