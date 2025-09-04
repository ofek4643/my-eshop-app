import User from "../models/User";
import Order from "../models/Order";

import bcrypt from "bcrypt";
import { Request, Response } from "express";

// הרחבת Request של Express כדי שיהיה לנו userId
interface AuthRequest extends Request {
  user: {
    userId: string;
    role: string;
    userName: string;
  };
}

// מושכת את פרטי המשתמש הנוכחי
export const fetchUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.user.userId;
    const user = await User.findById(id).select("userName email _id");
    if (!user) {
      res.status(404).json({ message: "משתמש לא נמצא" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// מוחק את המשתמש הנוכחי ואת העוגיה
export const fetchDeleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.userId;
    const undeliveredOrders = await Order.find({ userId, isDelivered: false });

    if (undeliveredOrders.length > 0) {
      return res
        .status(400)
        .json({ error: "לא ניתן למחוק משתמש עם הזמנות שטרם נמסרו" });
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "המשתמש נמחק בהצלחה" });
  } catch (error) {
    return res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// מעדכן את פרטי המשתמש
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const id = req.user.userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "לא נמצא יוזר" });
    }
    const { userName, email, newPassword, confirmNewPassword } = req.body;

    const userNameExist = await User.findOne({ userName });
    const emailExist = await User.findOne({ email });

    if (userNameExist && userNameExist._id.toString() !== id) {
      return res.status(400).json({ error: "שם משתמש כבר קיים במערכת" });
    }
    if (emailExist && emailExist._id.toString() !== id) {
      return res.status(400).json({ error: "איימל כבר קיים במערכת" });
    }
    if (newPassword && newPassword.trim() !== "") {
      if (newPassword === confirmNewPassword) {
        const hashednewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashednewPassword;
      } else {
        return res.status(400).json({ error: "סיסמאות לא תאומות" });
      }
    }

    user.userName = userName;
    user.email = email;

    await user.save();
    return res.status(200).json({ message: "יוזר עודכן בהצלחה" });
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};
