import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { ZodError } from "zod";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  console.error(error);

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    // Return the first error message from Zod validation
    const message = error.errors?.[0]?.message || error.issues?.[0]?.message || "Validation failed";
    response.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message,
      },
    });
    return;
  }

  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    },
  });
}
