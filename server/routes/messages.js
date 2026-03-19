const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Listing = require("../models/Listing");
const logger = require("../utils/logger");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");

// Validation middleware for message sending
const validateMessage = [
  body("receiver").isMongoId().withMessage("Invalid receiver ID"),
  body("listing").isMongoId().withMessage("Invalid listing ID"),
  body("message")
    .isLength({ min: 1, max: 500 })
    .withMessage("Message must be 1-500 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// @desc    Get messages for a listing (between user and host)
// @route   GET /api/messages/:listingId
// @access  Private
router.get("/:listingId", authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate(
      "host",
    );
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the host or the sender/receiver
    if (
      listing.host._id.toString() !== req.user._id.toString() &&
      req.user._id.toString() !== req.query.otherUser
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({
      listing: req.params.listingId,
      $or: [
        { sender: req.user._id, receiver: listing.host._id },
        { sender: listing.host._id, receiver: req.user._id },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    logger.error("Get messages error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
router.post("/", authMiddleware, validateMessage, async (req, res) => {
  const { receiver, listing, message } = req.body;

  try {
    // Verify the listing exists and receiver is the host
    const listingDoc = await Listing.findById(listing).populate("host");
    if (!listingDoc) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listingDoc.host._id.toString() !== receiver) {
      return res.status(400).json({ message: "Invalid receiver" });
    }

    // Create message
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver,
      listing,
      message,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    logger.error("Send message error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
