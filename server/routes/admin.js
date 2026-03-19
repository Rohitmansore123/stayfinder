const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const logger = require("../utils/logger");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    logger.error("Get users error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { role } = req.body;
    if (!["user", "host", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true },
      ).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      logger.error("Update user role error", { error: err });
      res.status(500).json({ message: "Server error" });
    }
  },
);

// @desc    Get all listings
// @route   GET /api/admin/listings
// @access  Admin
router.get("/listings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find().populate("host", "name email");
    res.json(listings);
  } catch (err) {
    logger.error("Get listings error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Delete listing
// @route   DELETE /api/admin/listings/:id
// @access  Admin
router.delete(
  "/listings/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.json({ message: "Listing deleted" });
    } catch (err) {
      logger.error("Delete listing error", { error: err });
      res.status(500).json({ message: "Server error" });
    }
  },
);

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Admin
router.get("/bookings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("listing", "title");
    res.json(bookings);
  } catch (err) {
    logger.error("Get bookings error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get stats
// @route   GET /api/admin/stats
// @access  Admin
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [userCount, listingCount, bookingCount, reviewCount] =
      await Promise.all([
        User.countDocuments(),
        Listing.countDocuments(),
        Booking.countDocuments(),
        Review.countDocuments(),
      ]);

    res.json({
      users: userCount,
      listings: listingCount,
      bookings: bookingCount,
      reviews: reviewCount,
    });
  } catch (err) {
    logger.error("Get stats error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
