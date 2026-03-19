const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Listing = require("../models/Listing");
const logger = require("../utils/logger");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");

// Validation middleware for review creation
const validateReview = [
  body("listing").isMongoId().withMessage("Invalid listing ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .isLength({ min: 10, max: 500 })
    .withMessage("Comment must be 10-500 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// @desc    Get all reviews for a listing
// @route   GET /api/reviews/:listingId
// @access  Public
router.get("/:listingId", async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    logger.error("Get reviews error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
router.post("/", authMiddleware, validateReview, async (req, res) => {
  const { listing, rating, comment } = req.body;

  try {
    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({
      user: req.user._id,
      listing,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this listing" });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      listing,
      rating,
      comment,
    });

    // Update listing average rating
    const allReviews = await Review.find({ listing });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Listing.findByIdAndUpdate(listing, { rating: avgRating.toFixed(1) });

    res.status(201).json(review);
  } catch (err) {
    logger.error("Create review error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Review owner only)
router.put("/:id", authMiddleware, validateReview, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update listing average rating
    const allReviews = await Review.find({ listing: review.listing });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Listing.findByIdAndUpdate(review.listing, {
      rating: avgRating.toFixed(1),
    });

    res.json(review);
  } catch (err) {
    logger.error("Update review error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Review owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.remove();

    // Update listing average rating
    const allReviews = await Review.find({ listing: review.listing });
    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await Listing.findByIdAndUpdate(review.listing, {
        rating: avgRating.toFixed(1),
      });
    } else {
      await Listing.findByIdAndUpdate(review.listing, { rating: 0 });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    logger.error("Delete review error", { error: err });
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
