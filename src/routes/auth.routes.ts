import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  completeUserProfile,
  getProfile,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.patch("/profile", authMiddleware, completeUserProfile);

router.get("/profile", authMiddleware, getProfile);

export default router;
