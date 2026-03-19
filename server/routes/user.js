const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// @desc    Get current logged-in user's data
// @route   GET /api/user/me
// @access  Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // authMiddleware ke through user data populate ho jata hai
    res.status(200).json(req.user);
  } catch (err) {
    logger.error("Get user profile error", { error: err });
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
