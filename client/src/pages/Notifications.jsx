import { useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useSocket } from "../context/SocketContext.jsx";
import Avatar from "../components/Avatar.jsx";
import { HeartIcon, CommentIcon, UserPlusIcon, BellIcon } from "../components/Icons.jsx";
import { timeAgo } from "../utils/format.js";

const VERB = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
};

const TYPE_ICON = {
  like: <HeartIcon filled width={10} height={10} />,
  comment: <CommentIcon filled width={10} height={10} />,
  follow: <UserPlusIcon width={10} height={10} />,
};

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
        <div className="card empty">
          <div className="empty-icon">
            <BellIcon width={26} height={26} />
          </div>
          <h3>No activity yet</h3>
          <p>When someone likes, comments, or follows you, it shows up here — instantly.</p>
        </div>
      ) : (
        <div className="card notif-list">
          {notifications.map((n) => (
            <div key={n._id} className={`notif-row ${n.read ? "" : "unread"}`}>
              <div className="notif-avatar">
                <Avatar user={n.sender} size={40} />
                <span className={`notif-type notif-type-${n.type}`}>
                  {TYPE_ICON[n.type]}
                </span>
              </div>
              <div className="notif-text">
                <Link to={`/u/${n.sender?.username}`} className="comment-name">
                  {n.sender?.name}
                </Link>{" "}
                {VERB[n.type]}
                <div className="post-meta">{timeAgo(n.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
