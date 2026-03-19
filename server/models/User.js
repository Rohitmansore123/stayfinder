const mongoose = require("mongoose");

// User Schema - Represents an authenticated user in the system
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: true,
      trim: true, // removes extra spaces
    },

    // Unique email for login (used as username)
    email: {
      type: String,
      required: true,
      unique: true, // no duplicate emails
      lowercase: true, // convert to lowercase
      trim: true,
    },

    // Password (hashed), excluded from query results by default
    password: {
      type: String,
      required: true,
      select: false, // hide password in default queries
    },

    // User role: user (guest), host, or admin
    role: {
      type: String,
      enum: ["user", "host", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  },
);

// Export the User model
module.exports = mongoose.model("User", userSchema);
