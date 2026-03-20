const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
} = require("../controllers/listingController");
const logger = require("../utils/logger");

const authMiddleware = require("../middleware/authMiddleware");
const { hostMiddleware } = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const { uploadToImgBB } = require("../utils/imgbbUpload");

// Setup local uploads directory for fallback (when Cloudinary is not configured)
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Validation middleware for listing creation
const validateListing = [
  body("title")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be 5-100 characters"),
  body("description")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("location").notEmpty().withMessage("Location is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// @desc    Upload images to ImgBB
// @route   POST /api/listings/upload
// @access  Private (Host)
router.post(
  "/upload",
  authMiddleware,
  hostMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const imgbbApiKey = process.env.IMGBB_API_KEY;

      if (!imgbbApiKey || imgbbApiKey === "your_imgbb_api_key") {
        return res.status(400).json({
          message: "Image upload not configured. Please set IMGBB_API_KEY.",
        });
      }

      const urls = await Promise.all(
        req.files.map(async (file) => {
          return uploadToImgBB(file.buffer, imgbbApiKey);
        }),
      );

      res.json({ urls });
    } catch (err) {
      logger.error("Image upload error", { error: err });
      const message =
        process.env.NODE_ENV === "production"
          ? "Upload failed"
          : `Upload failed: ${err.message}`;
      res.status(500).json({ message });
    }
  },
);

// @desc    Get listings for current user
// @route   GET /api/listings/my
// @access  Private
router.get("/my", authMiddleware, getMyListings);

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
router.get("/", getAllListings);

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
router.get("/:id", getListingById);

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private (Host only)
router.post(
  "/",
  authMiddleware,
  hostMiddleware,
  validateListing,
  createListing,
);

// @desc    Update a listing by ID
// @route   PUT /api/listings/:id
// @access  Private (Host only)
router.put("/:id", authMiddleware, updateListing);

// @desc    Delete a listing by ID
// @route   DELETE /api/listings/:id
// @access  Private (Host only)
router.delete("/:id", authMiddleware, deleteListing);

module.exports = router;
