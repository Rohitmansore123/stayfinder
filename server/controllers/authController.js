// Import required modules
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

// Utility function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

// ----------------------------
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ----------------------------
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate role
  const validRoles = ["user", "host"];
  const userRole = validRoles.includes(role) ? role : "user";

  try {
    // Check if user already exists with same email
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Generate JWT token for user
    const token = generateToken(user._id);

    // Respond with token and user info
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    logger.error("Register error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
// ----------------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user and include password in result
    const user = await User.findOne({ email }).select("+password");

    // If no user found or password doesn't match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Respond with token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    logger.error("Login error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// @desc    Update user profile (e.g., become host)
// @route   PUT /api/auth/profile
// @access  Private
// ----------------------------
exports.updateProfile = async (req, res) => {
  const { role } = req.body;

  try {
    // Only allow changing role to host if current role is user
    if (role === "host" && req.user.role === "user") {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { role: "host" },
        { new: true },
      ).select("-password");
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: "Invalid update" });
    }
  } catch (err) {
    logger.error("Update profile error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
};
