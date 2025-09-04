// ייבוא פונקציות Controllers עבור פעולות המשתמש
import express from "express";
import { captureOrder } from "../controllers/paymentController";
import { authMiddleware } from "../middleware/authMiddleware.ts";
const router = express.Router();

router.post("/capture-order", authMiddleware, captureOrder);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
