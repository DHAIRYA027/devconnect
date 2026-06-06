import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// Map of userId -> Set of socket ids (a user may have several tabs open).
const onlineUsers = new Map();
let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  });

  // Authenticate the socket connection using the same JWT as the REST API.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { userId } = socket;
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) onlineUsers.delete(userId);
      }
    });
  });

  return io;
};

// Push a real-time event to every open socket of a given user.
export const emitToUser = (userId, event, payload) => {
  if (!io) return;
  const sockets = onlineUsers.get(String(userId));
  if (!sockets) return;
  sockets.forEach((id) => io.to(id).emit(event, payload));
};
