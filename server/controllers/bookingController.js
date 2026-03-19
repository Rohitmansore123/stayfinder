const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");

// ----------------------------------------
// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Authenticated Users)
// ----------------------------------------
exports.createBooking = async (req, res) => {
  try {
    const { listing: listingId, checkIn, checkOut } = req.body;
    const user = req.user._id;

    // Get listing to calculate price
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    if (nights <= 0) {
      return res.status(400).json({ message: "Invalid dates" });
    }

    const totalPrice = listing.price * nights;

    // Check for overlapping bookings on same listing
    const overlap = await Booking.findOne({
      listing: listingId,
      $or: [{ checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }],
    });

    if (overlap) {
      return res.status(400).json({ message: "Dates not available" });
    }

    const booking = await Booking.create({
      user,
      listing: listingId,
      checkIn,
      checkOut,
      totalPrice,
    });

    // Respond with created booking
    res.status(201).json(booking);
  } catch (err) {
    logger.error("Create booking error", { error: err });
    res.status(500).json({ message: "Booking failed" });
  }
};

// --------------------------------------------------
// @desc    Get all bookings of logged-in user
// @route   GET /api/bookings/my
// @access  Private (Authenticated Users)
// --------------------------------------------------
exports.getUserBookings = async (req, res) => {
  try {
    // Find all bookings for the current user and populate listing details
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "listing",
    );

    res.json(bookings);
  } catch (err) {
    logger.error("Get user bookings error", { error: err });
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
