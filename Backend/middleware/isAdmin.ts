import { Request, Response, NextFunction } from "express";
import type { MyJwtPayload } from "./authMiddleware";

// Middleware לבדיקת הרשאות אדמין
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // אם אין בכלל משתמש מחובר
    if (!req.user) {
      return res.status(401).json({ error: "משתמש לא מחובר" });
    }

    // אין הרשאה למנהל
    if (req.user.role === "user") {
      return res.status(403).json({ error: "אין לך הרשאה" });
    }

    // ממשיכים
    next();
  } catch (error) {
    console.error("שגיאה בבדיקת הרשאות:", error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};
