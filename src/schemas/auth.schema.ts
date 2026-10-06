import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8),

  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: "You must accept the Terms of Service and Privacy Policy",
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(1),
});

export const completeProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  avatarUrl: z.string().url("Invalid avatar URL").nullable().optional(),
});
