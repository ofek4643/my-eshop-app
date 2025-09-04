import Order from "../models/Order";
import User from "../models/User";

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

export const updateDelivered = async (req, res) => {
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

export const getAllOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};
