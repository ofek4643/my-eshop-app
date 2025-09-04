// ייבוא פונקציות Controllers עבור פעולות המשתמש
import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/addProduct", addProduct);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
