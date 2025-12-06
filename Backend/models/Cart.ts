import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    amount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema , "Cart");