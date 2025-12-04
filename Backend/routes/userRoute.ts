// ייבוא פונקציות Controllers עבור פעולות המשתמש
import {
  deleteUser,
  fetchAdmin,
  fetchDeleteUser,
  fetchUser,
  fetchUserById,
  switchPermissions,
  totalUsers,
  updateProfile,
  
} from "../controllers/userController.ts";
import { isAdmin } from "../middleware/isAdmin.ts"; // אימות מנהל
import { authAdmin } from "../middleware/authAdmin.ts"; // אימות משתמש


// ייבוא Express ו־Middleware לאימות משתמשים
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts"; // אימות משתמש
const router = express.Router();

router.post(
  "/admin/switchPermissions/:id",
  authAdmin,
  isAdmin,
  switchPermissions
);
router.get("/admin/:id", authAdmin, isAdmin, fetchUserById);
router.delete("/admin/delete/:id", authAdmin, isAdmin, deleteUser);
router.get("/admin/list/users", authAdmin, isAdmin, totalUsers);
router.get("/admin", authAdmin, isAdmin, fetchAdmin);
router.get("/", authMiddleware, fetchUser);
router.delete("/delete", authMiddleware, fetchDeleteUser);
router.put("/profile", authMiddleware, updateProfile);

// ייצוא ה־Router לשימוש ב־ server.ts
export default router;