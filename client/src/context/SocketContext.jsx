import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

// Manages the single Socket.io connection and a live notification feed.
export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  // Connect when logged in, disconnect when logged out.
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5050", {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("notification:new", (n) => {
      setNotifications((prev) => [n, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, notifications, setNotifications, unreadCount }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
