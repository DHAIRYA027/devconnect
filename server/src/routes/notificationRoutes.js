import { Router } from "express";
import { getNotifications, markAllRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, getNotifications);
router.put("/read", protect, markAllRead);

export default router;
