import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      minlength: [8, "שם המשתמש חייב להכיל לפחות 8 תווים"],
      required: true,
    },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      minlength: [8, "שם המשתמש חייב להכיל לפחות 8 תווים"],
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    code: {
      type: Number,
    },
    codeExpiresAt: {
      type: Date,
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);