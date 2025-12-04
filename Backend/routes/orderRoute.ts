// ייבוא פונקציות Controllers עבור פעולות המשתמש
import {
  getOrder,
  updateDelivered,
  getAllOrderUser,
  getAllOrders,
  getOrdersAdmin,
  deleteOrdersAdmin,
  getOrderAdmin,
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware.ts"; // אימות משתמש
import { authAdmin } from "../middleware/authAdmin.ts"; // אימות מנהל
import { isAdmin } from "../middleware/isAdmin.ts"; // בדיקת הרשאות מנהל
import express from "express";
const router = express.Router();

router.delete("/admin/:id", authAdmin, isAdmin, deleteOrdersAdmin);
router.get("/admin/:id", authAdmin, isAdmin, getOrderAdmin);
router.get("/admin/userOrders/:id", authAdmin, isAdmin, getOrdersAdmin);
router.get("/admin", authAdmin, isAdmin, getAllOrders);
router.get("/:id", authMiddleware, getOrder);
router.put("/:id", authMiddleware, updateDelivered);
router.get("/", authMiddleware, getAllOrderUser);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;