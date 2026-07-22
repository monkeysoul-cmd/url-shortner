import express from "express";
import { connectDB } from "../server/config/db.js";
import authRouter from "../server/routes/auth.js";
import urlRouter from "../server/routes/url.js";
import analyticsRouter from "../server/routes/analytics.js";
import redirectRouter from "../server/routes/redirect.js";

const app = express();

// Ensure DB is connected for serverless invocations
connectDB();

// Middleware for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic security headers and CORS (Development safe)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Mount API Routers
app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);
app.use("/api/analytics", analyticsRouter);

// Mount the Redirection router
app.use("/", redirectRouter);

export default app;
