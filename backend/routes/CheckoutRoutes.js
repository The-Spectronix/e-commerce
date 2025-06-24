const express = require("express");
const Checkout = require("../models/Checkout");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ msg: "No items in cart" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout:", error);
    return res.status(500).send({ message: "Server Error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentDetails, paymentStatus } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id); // 🔧 FIXED from _id to id

    if (!checkout) {
      return res.status(404).json({ msg: "Checkout not found" });
    }

    if (paymentStatus === "Paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();
      res.status(200).json(checkout);
    } else {
      return res.status(400).json({ msg: "Invalid payment status" });
    }
  } catch (error) {
    console.error("Error marking checkout as paid:", error);
    return res.status(500).send("Server Error");
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id); // 🔧 FIXED from _id to id

    if (!checkout) {
      return res.status(404).json({ msg: "Checkout not found" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems, // 🔧 FIXED from orderItems to checkoutItems
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "Paid",
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      await Cart.findOneAndDelete({ user: checkout.user });

      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      return res.status(400).json({ msg: "Checkout already finalized" });
    } else {
      return res.status(400).json({ msg: "Checkout is not paid" });
    }
  } catch (error) {
    console.error("Error finalizing checkout:", error);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
