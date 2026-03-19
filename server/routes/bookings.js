const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBooking,
  getUserBookings,
} = require("../controllers/bookingController");
const { body, validationResult } = require("express-validator");

// Initialize Stripe only if API key is configured
let stripe = null;
if (
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== "sk_test_your_key_here"
) {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
}

const logger = require("../utils/logger");

// Validation middleware for booking creation
const validateBooking = [
  body("listing").isMongoId().withMessage("Invalid listing ID"),
  body("checkIn").isISO8601().withMessage("Invalid check-in date"),
  body("checkOut").isISO8601().withMessage("Invalid check-out date"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
router.post("/", authMiddleware, validateBooking, createBooking);

// @desc    Get all bookings of the logged-in user
// @route   GET /api/bookings/me
// @access  Private
router.get("/me", authMiddleware, getUserBookings);

module.exports = router;
