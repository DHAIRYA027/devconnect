import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

// Sidebar widget: suggests users you aren't following yet.
export default function WhoToFollow() {
  const { user, setUser } = useAuth();
  const [people, setPeople] = useState([]);

  useEffect(() => {
    api.get("/users").then((res) => {
      const suggestions = res.data.filter(
        (u) => u._id !== user._id && !user.following.includes(u._id)
      );
      setPeople(suggestions.slice(0, 5));
    });
  }, [user]);

  const follow = async (id) => {
    await api.post(`/users/${id}/follow`);
    setUser({ ...user, following: [...user.following, id] });
    setPeople((prev) => prev.filter((p) => p._id !== id));
  };

  if (people.length === 0) return null;

  return (
    <div className="card">
      <h3 className="sidebar-title">Who to follow</h3>
      {people.map((p) => (
        <div key={p._id} className="suggest-row">
          <Link to={`/u/${p.username}`} className="suggest-user">
            <Avatar user={p} size={36} />
            <div>
              <div className="suggest-name">{p.name}</div>
              <div className="suggest-handle">@{p.username}</div>
            </div>
          </Link>
          <button className="btn btn-primary btn-sm" onClick={() => follow(p._id)}>
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}
