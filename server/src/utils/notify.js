import Notification from "../models/Notification.js";
import { emitToUser } from "../socket.js";

// Creates a notification and pushes it live over Socket.io.
// Skips self-notifications (you liking your own post shouldn't ping you).
export const createNotification = async ({ recipient, sender, type, post }) => {
  if (String(recipient) === String(sender)) return null;

  const notification = await Notification.create({ recipient, sender, type, post });
  const populated = await notification.populate("sender", "name username avatar");

  emitToUser(recipient, "notification:new", populated);
  return populated;
};
