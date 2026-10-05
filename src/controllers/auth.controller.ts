import type { Request, Response } from "express";

import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

import { registerUser, loginUser } from "../services/auth/auth.service.js";

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
