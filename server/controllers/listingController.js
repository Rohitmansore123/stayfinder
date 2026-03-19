const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");

// ----------------------------------------------
// @desc    Get all listings (with optional filters)
// @route   GET /api/listings
// @access  Public
// ----------------------------------------------
exports.getAllListings = async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      minRating,
      amenities,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // Dynamic filter object
    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" }; // Case-insensitive partial match
    }
    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    if (amenities) {
      const amenityList = String(amenities)
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      if (amenityList.length) {
        filter.amenities = { $all: amenityList };
      }
    }

    let sortObj = {};
    if (sort) {
      switch (sort) {
        case "price_asc":
          sortObj.price = 1;
          break;
        case "price_desc":
          sortObj.price = -1;
          break;
        case "rating_desc":
          sortObj.rating = -1;
          break;
        case "newest":
          sortObj.createdAt = -1;
          break;
        default:
          break;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const query = Listing.find(filter).skip(skip).limit(Number(limit));
    if (Object.keys(sortObj).length) query.sort(sortObj);

    const listings = await query;
    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    logger.error("Get all listings error", { error: err });
    res.status(500).json({ message: "Error fetching listings" });
  }
};

// ----------------------------------------------
// @desc    Get listings for current user (host)
// @route   GET /api/listings/my
// @access  Private
// ----------------------------------------------
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id });
    res.json(listings);
  } catch (err) {
    logger.error("Get my listings error", { error: err });
    res.status(500).json({ message: "Error fetching listings" });
  }
};

// ----------------------------------------------
// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
// ----------------------------------------------
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    logger.error("Get listing by id error", { error: err });
    res.status(500).json({ message: "Error fetching listing" });
  }
};

// ----------------------------------------------
// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private (Host)
// ----------------------------------------------
exports.createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      host: req.user._id,
    });
    res.status(201).json(listing);
  } catch (err) {
    logger.error("Create listing error", { error: err });
    res.status(500).json({ message: "Error creating listing" });
  }
};

// ----------------------------------------------
// @desc    Update existing listing
// @route   PUT /api/listings/:id
// @access  Private (Host)
// ----------------------------------------------
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Listing.findByIdAndUpdate(id, req.body, {
      new: true, // Return updated document
    });

    res.json(updated);
  } catch (err) {
    logger.error("Update listing error", { error: err });
    res.status(500).json({ message: "Error updating listing" });
  }
};

// ----------------------------------------------
// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private (Host)
// ----------------------------------------------
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const deleted = await Listing.findByIdAndDelete(id);

    res.json({ message: "Listing deleted" });
  } catch (err) {
    logger.error("Delete listing error", { error: err });
    res.status(500).json({ message: "Error deleting listing" });
  }
};
