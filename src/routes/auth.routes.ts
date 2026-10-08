import { Router } from "express";

import {
  register,
  login,
  refresh,
  logout,
  completeUserProfile,
  getProfile,
  changeUserPassword,
  deleteUserAccount,
  getSessions,
  revokeUserSession,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// REFRESH TOKEN
router.post("/refresh", refresh);

// LOGOUT
router.post("/logout", logout);

// COMPLETE PROFILE
router.patch("/profile", authMiddleware, completeUserProfile);

// GET PROFILE
router.get("/profile", authMiddleware, getProfile);

// CHANGE PASSWORD
router.patch("/password", authMiddleware, changeUserPassword);

// DELETE ACCOUNT
router.delete("/account", authMiddleware, deleteUserAccount);

// SESSIONS
router.get("/sessions", authMiddleware, getSessions);
router.delete("/sessions/:id", authMiddleware, revokeUserSession);

export default router;
