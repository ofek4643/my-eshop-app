// ייבוא פונקציות Controllers עבור פעולות המשתמש
import { getOrder, updateDelivered , getAllOrder} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import express from "express";
const router = express.Router();

router.get("/:id", authMiddleware, getOrder);
router.put("/:id", authMiddleware, updateDelivered);
router.get("/", authMiddleware, getAllOrder);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
