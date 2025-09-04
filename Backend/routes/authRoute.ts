// ייבוא פונקציות Controllers עבור פעולות המשתמש
import {
  register,
  verifyUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import express from "express";
const router = express.Router();

router.post("/register", register);
router.get("/verify/:userId/:token", verifyUser);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;
