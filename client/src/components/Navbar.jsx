import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import Avatar from "./Avatar.jsx";
import { HomeIcon, CompassIcon, BellIcon, LogOutIcon } from "./Icons.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const badge = unreadCount > 0 && <span className="badge">{unreadCount}</span>;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            &lt;Dev<span>Connect</span>/&gt;
          </Link>

          <div className="nav-links">
            <NavLink to="/" end>
              <HomeIcon /> Feed
            </NavLink>
            <NavLink to="/explore">
              <CompassIcon /> Explore
            </NavLink>
            <NavLink to="/notifications" className="notif-link">
              <BellIcon /> Activity
              {badge}
            </NavLink>
          </div>

          <div className="nav-user">
            <Link to={`/u/${user?.username}`} className="nav-profile">
              <Avatar user={user} size={30} />
              <span className="nav-username">{user?.username}</span>
            </Link>
            <button className="icon-btn logout-btn" title="Log out" onClick={handleLogout}>
              <LogOutIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* App-style tab bar, shown only on small screens */}
      <nav className="bottom-nav">
        <NavLink to="/" end>
          <HomeIcon /> <span>Feed</span>
        </NavLink>
        <NavLink to="/explore">
          <CompassIcon /> <span>Explore</span>
        </NavLink>
        <NavLink to="/notifications" className="notif-link">
          <BellIcon />
          {badge}
          <span>Activity</span>
        </NavLink>
        <NavLink to={`/u/${user?.username}`}>
          <Avatar user={user} size={20} /> <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
}
