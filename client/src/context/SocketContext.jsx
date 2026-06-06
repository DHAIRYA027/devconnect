import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

// Manages the single Socket.io connection and a live notification feed.
export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Connect when logged in, disconnect when logged out. The socket lives
  // inside the effect — consumers only need the notification state it feeds.
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5050", {
      auth: { token },
    });
    socket.on("notification:new", (n) => {
      setNotifications((prev) => [n, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SocketContext.Provider value={{ notifications, setNotifications, unreadCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
