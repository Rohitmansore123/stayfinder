const mongoose = require("mongoose");

// Favorite Schema - Represents user's favorite listings
const favoriteSchema = new mongoose.Schema(
  {
    // User who favorited
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Favorited listing
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

// Compound index to prevent duplicates
favoriteSchema.index({ user: 1, listing: 1 }, { unique: true });

// Export the Favorite model
module.exports = mongoose.model("Favorite", favoriteSchema);
