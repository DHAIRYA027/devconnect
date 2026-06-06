import { useEffect, useState } from "react";
import api from "../api/axios.js";
import PostCard from "../components/PostCard.jsx";
import PostSkeleton from "../components/PostSkeleton.jsx";
import WhoToFollow from "../components/WhoToFollow.jsx";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts/explore")
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  return (
    <div className="layout">
      <main className="feed">
        <h2 className="page-title">Explore</h2>
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
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
