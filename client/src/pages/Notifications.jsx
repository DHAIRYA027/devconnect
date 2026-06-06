import { useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useSocket } from "../context/SocketContext.jsx";
import Avatar from "../components/Avatar.jsx";
import { timeAgo } from "../utils/format.js";

const verb = { like: "liked your post", comment: "commented on your post", follow: "started following you" };

export default function Notifications() {
  const { notifications, setNotifications } = useSocket();

  // Load history once, then mark everything read.
  useEffect(() => {
    api.get("/notifications").then((res) => setNotifications(res.data));
    api.put("/notifications/read").then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  }, [setNotifications]);

  return (
    <div className="layout-narrow">
      <h2 className="page-title">Activity</h2>
      {notifications.length === 0 ? (
        <div className="card empty">No activity yet. Go make some noise! 📣</div>
      ) : (
        <div className="card notif-list">
          {notifications.map((n) => (
            <div key={n._id} className={`notif-row ${n.read ? "" : "unread"}`}>
              <Avatar user={n.sender} size={40} />
              <div className="notif-text">
                <Link to={`/u/${n.sender?.username}`} className="comment-name">
                  {n.sender?.name}
                </Link>{" "}
                {verb[n.type]}
                <div className="post-meta">{timeAgo(n.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
