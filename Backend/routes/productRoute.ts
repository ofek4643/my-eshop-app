// ייבוא פונקציות Controllers עבור פעולות המשתמש
import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/productController";
import { isAdmin } from "../middleware/isAdmin.ts"; // בדיקת הראשות מנהל
import { authAdmin } from "../middleware/authAdmin.ts"; // אימות מנהל

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authAdmin, isAdmin, updateProductById);
router.post("/", authAdmin, isAdmin, addProduct);
router.delete("/:id", authAdmin, isAdmin, deleteProduct);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;