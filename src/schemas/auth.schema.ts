import { z } from "zod";

// REGISTER
export const registerSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8),

  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: "You must accept the Terms of Service and Privacy Policy",
  }),

  deviceName: z.string().optional(),
  deviceType: z.string().optional(),
});

// LOGIN
export const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(1),

  deviceName: z.string().optional(),
  deviceType: z.string().optional(),
});

// COMPLETE PROFILE
export const completeProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  avatarUrl: z.string().url("Invalid avatar URL").nullable().optional(),
});

// REFRESH TOKEN
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// CHANGE PASSWORD
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128, "New password must not exceed 128 characters"),

    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// DELETE ACCOUNT
export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),

  reason: z
    .string()
    .trim()
    .max(500, "Reason must not exceed 500 characters")
    .optional(),
});
