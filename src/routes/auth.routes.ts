import { Router } from "express";

import {
  register,
  login,
  completeUserProfile,
  getProfile,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.patch("/profile", authMiddleware, completeUserProfile);

router.get("/profile", authMiddleware, getProfile);

export default router;
