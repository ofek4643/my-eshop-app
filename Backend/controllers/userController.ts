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
    email: string;
  };
}

// מושכת את פרטי המשתמש הנוכחי
export const fetchUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.user.userId;
    const user = await User.findById(id);
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
    return res.status(200).json({ message: "יוזר עודכן בהצלחה", user: user });
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// אדמין - משיכת משתמשים
export const totalUsers = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// אדמין - מחיקת משתמש
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.status(200).json("משתתמש נמחק בהצלחה");
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// אדמין - שליפת משתמש על פי ID
export const fetchUserById = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "משתמש לא נמצא" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// שליפת משתמש אדמין
export const fetchAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const adminId = req.user.userId;
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "לא קיים מנהל" });
    }

    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// אדמין - שינוי הרשאות למשתמש
export const switchPermissions = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { newRole } = req.body;
    const user = await User.findById(id);
    const admin = await User.findById(userId);

    if (admin?.role !== "superAdmin") {
      return res.status(403).json({ error: "אין לך הרשאה לשנות הרשאות" });
    }
    if (!user) {
      return res.status(404).json({ error: "משתמש לא קיים" });
    }
    if (!newRole || (newRole !== "user" && newRole !== "admin")) {
      return res.status(400).json({ error: "רול לא קיים" });
    }
    if (user._id.equals(admin._id)) {
      return res.status(400).json({ error: "אי אפשר לשנות את הראשות של עצמך" });
    }
    user.role = newRole;
    await user.save();
    return res.status(201).json({ message: "הראשות עודכנו בהצלחה" });
  } catch (error) {
    return res.status(500).json({ error: "שגיאה בשרת" });
  }
};