const mongoose = require("mongoose");

// Message Schema - Represents messages between users and hosts for listings
const messageSchema = new mongoose.Schema(
  {
    // Sender of the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Receiver of the message
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Listing the message is about
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    // Message content
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

// Export the Message model
module.exports = mongoose.model("Message", messageSchema);
