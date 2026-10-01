import { Router } from "express";
import healthRoutes from "./health.routes.js";
import chatRoutes from "./chat.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/chats", chatRoutes);

export default router;
