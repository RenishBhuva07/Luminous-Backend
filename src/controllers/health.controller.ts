import type { Request, Response } from "express";

export function healthController(_request: Request, response: Response) {
    response.json({
        success: true,
        message: "AI Chatbot API is healthy",
    });
}