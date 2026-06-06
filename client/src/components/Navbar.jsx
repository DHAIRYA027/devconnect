import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import Avatar from "./Avatar.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          &lt;Dev<span>Connect</span>/&gt;
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>
            Feed
          </NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/notifications" className="notif-link">
            Activity
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </NavLink>
        </div>

        <div className="nav-user">
          <Link to={`/u/${user?.username}`} className="nav-profile">
            <Avatar user={user} size={32} />
            <span>{user?.username}</span>
          </Link>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
