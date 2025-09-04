import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

// מייבא את שגיאות ברירת המחדל של jwt לטיפול ייחודי
export const { TokenExpiredError, JsonWebTokenError } = jwt;
import { Request, Response, NextFunction } from "express";

// הרחבת ה־ Payload כך שיכלול מידע נוסף על המשתמש (שאתה שומר בטוקן)
interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
  userName: string;
}

// הרחבת טיפוס ה־ Request של Express כך שיכיל שדה user (שיתווסף אחרי אימות הטוקן)
declare module "express-serve-static-core" {
  interface Request {
    user: MyJwtPayload;
  }
}

// Middleware לאימות משתמשים JWT
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // שולף את הטוקן מהעוגיות
  const token = req.cookies?.token;
  const JWT_SECRET = process.env.JWT_SECRET;

  // אם אין טוקן המשתמש לא מחובר
  if (!token) return res.status(401).json({ error: "משתמש לא מחובר" });
  if (!JWT_SECRET) {
    throw new Error("חסר מפתח סודי של טוקן");
  }
  try {
    // מאמת את הטוקן ומחזיר את הנתונים המקוריים שנשמרו בו
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    req.user = decoded;

    // ממשיך ל route הבא
    next();
  } catch (error: unknown) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "הטוקן פג תוקף, אנא התחבר מחדש" });
    } else if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ error: "טוקן לא תקין" });
    } else {
      return res.status(401).json({ error: "שגיאה באימות הטוקן" });
    }
  }
};
