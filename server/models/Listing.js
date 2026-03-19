const mongoose = require("mongoose");

// Listing Schema - Represents a property listed by a host
const listingSchema = new mongoose.Schema(
  {
    // Property Title (e.g., "Cozy 2BHK Apartment")
    title: {
      type: String,
      required: true,
    },

    // Location or City of the property
    location: {
      type: String,
      required: true,
    },

    // Price per night or stay
    price: {
      type: Number,
      required: true,
    },

    // Array of image URLs
    images: [
      {
        type: String,
        default: "default-house.jpg", // fallback image
      },
    ],

    // Optional description of the property
    description: {
      type: String,
    },

    // Amenities offered by the property (e.g., WiFi, AC)
    amenities: {
      type: [String],
      default: [],
    },

    // Average rating (out of 5)
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    // Reference to the user (host) who created the listing
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Exporting the Listing model
module.exports = mongoose.model("Listing", listingSchema);
