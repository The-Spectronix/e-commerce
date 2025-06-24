const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    image: String,
    price: {
      type: Number,
      required: true,
    },
    size: String,
    color: String,
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        // Require user or guestId
        return !this.guestId;
      }
    },
    guestId: {
      type: String,
      required: function () {
        return !this.user;
      }
    },
    products: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
