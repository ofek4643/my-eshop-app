import Order from "../models/Order";
import Product from "../models/Product";

import { Request, Response } from "express";
import { AddressFormData } from "../../Frontend/src/types/Address";
import { OrderItem } from "../../Frontend/src/types/Order";

// הרחבת Request של Express כדי שיהיה לנו userId
interface AuthRequest extends Request {
  user: {
    userId: string;
    role: string;
    userName: string;
    email: string;
  };
}
// פונקציה ליצירת הזמנה
export const captureOrder = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  const {
    items,
    totalPrice,
    address,
  }: { items: OrderItem[]; totalPrice: string; address: AddressFormData } =
    req.body;
  const { userId, userName, email } = req.user;

  try {
    // בדיקה אם יש מספיק מלאי לכל המוצרים
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `המוצר ${item.name} לא נמצא` });
      }
      if (item.amount > product.stock) {
        return res.status(400).json({
          error: `אין מספיק מלאי למוצר ${item.name}. נותרו ${product.stock} יחידות.`,
        });
      }
    }

    // עדכון המלאי בפועל
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.amount },
      });
    }

    // יצירת ההזמנה
    const newOrder = await Order.create({
      userId,
      userName,
      email,
      items,
      totalPrice,
      isDelivered: false,
      address,
    });

    return res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};