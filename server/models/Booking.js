const mongoose = require("mongoose");

// Booking Schema for StayFinder
const bookingSchema = new mongoose.Schema(
  {
    // Reference to the user who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the listing being booked
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    // Check-in date for the booking
    checkIn: {
      type: Date,
      required: true,
    },

    // Check-out date for the booking
    checkOut: {
      type: Date,
      required: true,
    },

    // Total price for the stay (calculated on frontend/backend)
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Export Booking model
module.exports = mongoose.model("Booking", bookingSchema);
