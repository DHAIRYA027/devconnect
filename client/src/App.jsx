import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Feed from "./pages/Feed.jsx";
import Explore from "./pages/Explore.jsx";
import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";
import EditProfile from "./pages/EditProfile.jsx";

// Wraps protected pages with the navbar and a centered content container.
const Shell = ({ children }) => (
  <ProtectedRoute>
    <Navbar />
    <div className="container">{children}</div>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Shell><Feed /></Shell>} />
            <Route path="/explore" element={<Shell><Explore /></Shell>} />
            <Route path="/notifications" element={<Shell><Notifications /></Shell>} />
            <Route path="/settings" element={<Shell><EditProfile /></Shell>} />
            <Route path="/u/:username" element={<Shell><Profile /></Shell>} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
