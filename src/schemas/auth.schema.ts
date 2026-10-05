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
