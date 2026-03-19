// Import mongoose for MongoDB connection
const mongoose = require("mongoose");
const logger = require("../utils/logger");

// Function to connect to MongoDB using environment variable
const connectDB = async () => {
  try {
    // Attempt to connect with MongoDB URI
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(uri);

    // Connection successful
    logger.info("MongoDB connected");
  } catch (err) {
    // Connection failed
    logger.error("MongoDB Connection Error", { error: err });

    // Exit the process with failure
    process.exit(1);
  }
};

// Export the connectDB function
module.exports = connectDB;
