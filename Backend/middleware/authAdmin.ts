import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
export const { TokenExpiredError, JsonWebTokenError } = jwt;
import { Request, Response, NextFunction } from "express";

// הרחבת ה־ Payload כך שיכלול מידע נוסף על המשתמש (שאתה שומר בטוקן)
export interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string;
  userName: string;
  email: string;
}

// הרחבת טיפוס ה־ Request של Express כך שיכיל שדה user (שיתווסף אחרי אימות הטוקן)
declare module "express-serve-static-core" {
  interface Request {
    user: MyJwtPayload;
  }
}

// Middleware לאימות מנהלים JWT
export const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.adminToken;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!token) return res.status(401).json({ error: "אדמין לא מחובר" });
  if (!JWT_SECRET) throw new Error("חסר מפתח סודי של טוקן");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    req.user = decoded;
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
