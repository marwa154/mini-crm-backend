import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👤 Authenticated users
router.get("/me", protect, getMyProfile);

// 👑 Admin only routes
router.get("/", protect, adminOnly, getAllUsers);
router.post("/", protect, adminOnly, createUser);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
//djjj