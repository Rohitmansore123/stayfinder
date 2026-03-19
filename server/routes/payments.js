const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = require("stripe");
  stripe = Stripe(process.env.STRIPE_SECRET_KEY);
}

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
router.post("/create-intent", authMiddleware, async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: "Payment system not configured" });
  }

  const { amount, listingId } = req.body; // amount in cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { listingId, userId: req.user._id },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    logger.error("Create payment intent error", { error: err });
    res.status(500).json({ message: "Payment setup failed" });
  }
});

module.exports = router;
