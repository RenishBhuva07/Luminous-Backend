import { Router } from "express";

import {
  sendMessage,
  getChats,
  getMessages,
  continueChat,
  updateChat,
  removeChat,
} from "../controllers/chat.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// All chat endpoints require authentication.
router.use(authMiddleware);

// Create a chat automatically when the first message is sent.
router.post("/messages", sendMessage);

// List conversations.
router.get("/", getChats);

// Existing conversation message history and replies.
router.get("/:chatId/messages", getMessages);
router.post("/:chatId/messages", continueChat);

// Chat management.
router.patch("/:chatId", updateChat);
router.delete("/:chatId", removeChat);

export default router;
