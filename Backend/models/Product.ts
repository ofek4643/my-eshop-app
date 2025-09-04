import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
