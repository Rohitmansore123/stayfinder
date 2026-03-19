const mongoose = require("mongoose");

// Review Schema - Represents user reviews for listings
const reviewSchema = new mongoose.Schema(
  {
    // User who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Listing being reviewed
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    // Rating out of 5
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Review comment
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

// Compound index to prevent multiple reviews per user per listing
reviewSchema.index({ user: 1, listing: 1 }, { unique: true });

// Export the Review model
module.exports = mongoose.model("Review", reviewSchema);
