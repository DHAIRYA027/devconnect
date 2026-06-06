import { Router } from "express";
import {
  getProfile,
  updateProfile,
  toggleFollow,
  searchUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, searchUsers);
router.put("/me", protect, updateProfile);
router.post("/:id/follow", protect, toggleFollow);
router.get("/:username", protect, getProfile);

export default router;
