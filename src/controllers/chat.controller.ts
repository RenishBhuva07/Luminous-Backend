import type { Request, Response } from "express";
import { sendMessageSchema } from "../schemas/chat.schema.js";
import { sendChatMessage } from "../services/chat/chat.service.js";

export async function sendMessage(request: Request, response: Response) {
  const input = sendMessageSchema.parse(request.body);

  const result = await sendChatMessage(input.message);

  response.json({
    success: true,
    data: {
      message: result,
    },
  });
}
