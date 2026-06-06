import { useEffect, useState } from "react";
import api from "../api/axios.js";
import CreatePost from "../components/CreatePost.jsx";
import PostCard from "../components/PostCard.jsx";
import WhoToFollow from "../components/WhoToFollow.jsx";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get("/posts/feed")
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleNew = (post) => setPosts((prev) => [post, ...prev]);
  const handleDelete = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  return (
    <div className="layout">
      <main className="feed">
        <CreatePost onPost={handleNew} />
        {loading ? (
          <div className="card muted">Loading your feed…</div>
        ) : posts.length === 0 ? (
          <div className="card empty">
            <h3>Your feed is quiet 🌱</h3>
            <p>Follow some developers from the Explore tab to fill it up.</p>
          </div>
        ) : (
          posts.map((p) => <PostCard key={p._id} post={p} onDelete={handleDelete} />)
        )}
      </main>
      <aside className="sidebar">
        <WhoToFollow />
      </aside>
    </div>
  );
}
