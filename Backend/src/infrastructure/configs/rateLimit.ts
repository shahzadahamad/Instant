import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests, please try again later.",
  headers: true, // Show rate limit headers
  standardHeaders: true,
  legacyHeaders: false,
});