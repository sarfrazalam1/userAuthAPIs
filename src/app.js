import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests, please try again, after 15 minutes.",
  },
});
app.use("/api", limiter);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "active", uptime: process.uptime() });
});

app.use(errorHandler);

export { app };
