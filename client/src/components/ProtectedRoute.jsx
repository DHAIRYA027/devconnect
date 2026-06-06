import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Gates routes that require login. Waits for the auth check to finish
// so we don't flash the login page for already-authenticated users.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-screen">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
