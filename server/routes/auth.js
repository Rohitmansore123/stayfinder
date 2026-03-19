const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", register);

// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", login);

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // req.user is set in authMiddleware after verifying token
    res.json(req.user);
  } catch (err) {
    logger.error("Get profile error", { error: err });
    res.status(500).json({ message: "Something went wrong" });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
