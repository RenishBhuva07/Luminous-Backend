import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRoutes from "./routes/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { apiRateLimiter } from "./middleware/rate-limit.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use(apiRateLimiter);

app.use("/api/v1", apiRoutes);

app.use(errorMiddleware);

export default app;
