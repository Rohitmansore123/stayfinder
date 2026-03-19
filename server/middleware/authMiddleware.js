const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Middleware to protect routes by verifying JWT token.
 * Adds user data (excluding password) to req.user if token is valid.
 *
 * @access  Private (Authenticated users only)
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB and attach to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    next();
  } catch (error) {
    logger.error("JWT Error", { message: error.message, stack: error.stack });
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

/**
 * Middleware to ensure user is a host.
 * Must be used after authMiddleware.
 *
 * @access  Private (Hosts only)
 */
const hostMiddleware = (req, res, next) => {
  if (req.user.role !== "host") {
    return res.status(403).json({ message: "Access denied - Hosts only" });
  }
  next();
};

module.exports = authMiddleware;
module.exports.hostMiddleware = hostMiddleware;
