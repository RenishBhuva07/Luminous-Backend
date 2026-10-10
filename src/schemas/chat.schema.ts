import { z } from "zod";

export const sendMessageSchema = z.object({
  message: z.string().trim().min(1).max(10000),
});

export const chatIdSchema = z.object({
  chatId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid chat ID"),
});

export const renameChatSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

export const getChatsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
});

export const getMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  before: z.string().datetime().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
