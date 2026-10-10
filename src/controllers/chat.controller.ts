import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  sendMessageSchema,
  chatIdSchema,
  renameChatSchema,
  getChatsQuerySchema,
  getMessagesQuerySchema,
} from "../schemas/chat.schema.js";

import {
  createChatWithMessage,
  getUserChats,
  getChatMessages,
  sendMessageToChat,
  renameChat,
  deleteChat,
} from "../services/chat/chat.service.js";

import { AppError } from "../utils/app-error.js";

function getAuthenticatedUserId(request: Request): string {
  const userId = (request as AuthenticatedRequest).userId;

  if (!userId) {
    throw new AppError(
      "Authentication required",
      401,
      "AUTHENTICATION_REQUIRED",
    );
  }

  return userId;
}

// POST /chats/messages - Creates a chat and sends the initial message
export async function sendMessage(request: Request, response: Response) {
  const input = sendMessageSchema.parse(request.body);
  const userId = getAuthenticatedUserId(request);

  const result = await createChatWithMessage(userId, input.message);

  return response.status(201).json({
    success: true,
    data: result,
  });
}

// GET /chats - Retrieves user's recent conversations
export async function getChats(request: Request, response: Response) {
  const query = getChatsQuerySchema.parse(request.query);
  const userId = getAuthenticatedUserId(request);

  const result = await getUserChats(userId, query.page, query.limit);

  return response.status(200).json({
    success: true,
    data: result,
  });
}

// GET /chats/:chatId/messages - Retrieves messages for a specific conversation
export async function getMessages(request: Request, response: Response) {
  const { chatId } = chatIdSchema.parse(request.params);
  const query = getMessagesQuerySchema.parse(request.query);
  const userId = getAuthenticatedUserId(request);

  const result = await getChatMessages(
    userId,
    chatId,
    query.limit,
    query.before,
  );

  return response.status(200).json({
    success: true,
    data: result,
  });
}

// POST /chats/:chatId/messages - Sends a new message in an existing conversation
export async function continueChat(request: Request, response: Response) {
  const { chatId } = chatIdSchema.parse(request.params);
  const input = sendMessageSchema.parse(request.body);
  const userId = getAuthenticatedUserId(request);

  const result = await sendMessageToChat(userId, chatId, input.message);

  return response.status(200).json({
    success: true,
    data: result,
  });
}

// PATCH /chats/:chatId - Updates conversation title
export async function updateChat(request: Request, response: Response) {
  const { chatId } = chatIdSchema.parse(request.params);
  const input = renameChatSchema.parse(request.body);
  const userId = getAuthenticatedUserId(request);

  const result = await renameChat(userId, chatId, input.title);

  return response.status(200).json({
    success: true,
    data: { chat: result },
  });
}

// DELETE /chats/:chatId - Deletes conversation and all associated messages
export async function removeChat(request: Request, response: Response) {
  const { chatId } = chatIdSchema.parse(request.params);
  const userId = getAuthenticatedUserId(request);

  const result = await deleteChat(userId, chatId);

  return response.status(200).json({
    success: true,
    data: result,
  });
}
