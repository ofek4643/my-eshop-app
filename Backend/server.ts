import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";

import connectDB from "./config/db";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import cartRouter from "./routes/cartRoute";
import paymentRouter from "./routes/paymentRoute";
import orderRouter from "./routes/orderRoute";

// קריאת ENV
dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://eshop-project-react-1.onrender.com",
  "https://eshop-crm-react.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// שימוש בעוגיות וקריאת json
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3000;

// חיבור למסד נתונים
connectDB();

// הודעה שהשרת פועל
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "EShop API Server is running!" });
});

// שימוש בראוטרים
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);

// הפעלת השרת
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
