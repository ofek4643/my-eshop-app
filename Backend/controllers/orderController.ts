import Order from "../models/Order";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user: {
    userId: string;
    role: string;
    userName: string;
    email: string;
  };
}

// שליפת הזמנה
export const getOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};
// אדמין - שליפת הזמנה
export const getOrderAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// עדכון סטטוס הזמנה על פי ID
export const updateDelivered = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ error: "ההזמנה לא נמצאה" });
    }
    if (order.isDelivered) {
      return res.status(400).json({ error: "ההזמנה כבר נשלחה" });
    }
    order.isDelivered = true;
    await order.save();

    return res.status(200).json({ message: "נהדר! שמחים שהזמנה הגיעה" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// שליפת הזמנות של משתמש
export const getAllOrderUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// אדמין - שליפת כל ההזמנות באתר
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// אדמין - שליפת כל ההזמנות של המשתמש
export const getOrdersAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// אדמין - מחיקת הזמנה על פי ID
export const deleteOrdersAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    return res.status(200).json("הזמנה נמחקה בהצלחה");
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};