import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        amount: { type: Number, required: true },
        imageUrl: { type: String }, // שמירת תמונה של המוצר
      },
    ],
    totalPrice: { type: Number, required: true },
    address: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: String, required: true },
      zip: { type: String, required: true },
    },
    isDelivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
