import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route  GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("sender", "name username avatar");
  res.json(notifications);
});

// @route  PUT /api/notifications/read  — mark all as read
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );
  res.json({ message: "All notifications marked as read" });
});
