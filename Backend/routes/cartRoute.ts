// ייבוא פונקציות Controllers עבור פעולות המשתמש
import {
  addOneItemCart,
  clearCart,
  getCartItems,
  postItem,
  removeItemCart,
  removeOneItemCart,
  syncCart,
} from "../controllers/cartController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import express from "express";
const router = express.Router();

router.get("/", authMiddleware, getCartItems);
router.post("/addItem", authMiddleware, postItem);
router.put("/addOneItem", authMiddleware, addOneItemCart);
router.put("/removeOneItem", authMiddleware, removeOneItemCart);
router.delete("/removeItem", authMiddleware, removeItemCart);
router.post("/sync", authMiddleware, syncCart);
router.delete("/clear", authMiddleware, clearCart);


// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
