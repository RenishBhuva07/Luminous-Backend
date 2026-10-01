import { z } from "zod";

export const sendMessageSchema = z.object({
  message: z.string().trim().min(1).max(10_000),

  conversationId: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
