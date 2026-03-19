const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const logger = require("../utils/logger");
const authMiddleware = require("../middleware/authMiddleware");

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate(
      "listing",
    );
    res.json(favorites);
  } catch (err) {
    logger.error("Get favorites error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  const { listingId } = req.body;

  try {
    const favorite = await Favorite.create({
      user: req.user._id,
      listing: listingId,
    });
    res.status(201).json(favorite);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already in favorites" });
    }
    logger.error("Add favorite error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:listingId
// @access  Private
router.delete("/:listingId", authMiddleware, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user._id,
      listing: req.params.listingId,
    });
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    logger.error("Remove favorite error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
