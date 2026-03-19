// Load required modules
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

// Import route modules
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const userRoutes = require("./routes/user");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");
const favoriteRoutes = require("./routes/favorites");
const messageRoutes = require("./routes/messages");
const paymentRoutes = require("./routes/payments");
const adminRoutes = require("./routes/admin");

// Load environment variables from .env file
// When running from the `server` folder the root .env is one level up.
// dotenv.config() will look in the current working directory, so we
// explicitly specify the path to avoid undefined values.
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Configure Cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// ----------------------
// Middleware
// ----------------------
// Security middleware
app.use(helmet());

// Request logging (HTTP access logs)
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: morganStream,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        process.env.FRONTEND_URL,
      ].filter(Boolean); // Remove undefined values

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Parse incoming JSON requests
app.use(express.json());

// Serve uploaded images (allows local uploads in dev without Cloudinary)
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Force HTTPS in production (when behind a proxy/load balancer)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// ----------------------
// Routes
// ----------------------

// Auth routes (login, register)
app.use("/api/auth", authRoutes);

// Listing routes (add, update, delete, get)
app.use("/api/listings", listingRoutes);

// User routes (profile related)
app.use("/api/user", userRoutes);

// Booking routes (create, view bookings)
app.use("/api/bookings", bookingRoutes);

// Review routes (create, view reviews)
app.use("/api/reviews", reviewRoutes);

// Favorite routes (add, remove, view favorites)
app.use("/api/favorites", favoriteRoutes);

// Message routes (send, view messages)
app.use("/api/messages", messageRoutes);

// Payment routes (Stripe integration)
app.use("/api/payments", paymentRoutes);

// Admin routes (admin management)
app.use("/api/admin", adminRoutes);

// Base route (optional welcome message)
app.get("/", (req, res) => {
  res.send("Welcome to StayFinder API");
});

// ----------------------
// Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Something went wrong!"
      : err.message || "Something went wrong!";

  // Avoid logging sensitive fields
  const safeBody = { ...req.body };
  if (safeBody.password) safeBody.password = "***";
  if (safeBody.confirmPassword) safeBody.confirmPassword = "***";

  logger.error(errorMessage, {
    statusCode,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    body: safeBody,
    user: req.user ? { id: req.user._id, email: req.user.email } : undefined,
  });

  res.status(statusCode).json({ error: errorMessage });
});

// ----------------------
// Unhandled rejections & exceptions
// ----------------------
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error });
  process.exit(1);
});

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
