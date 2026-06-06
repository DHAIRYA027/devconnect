import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import { timeAgo } from "../utils/format.js";

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const liked = likes.some((id) => id === user._id || id?._id === user._id);

  const toggleLike = async () => {
    // Optimistic update — feels instant, reconciled by the response.
    setLikes((prev) =>
      liked ? prev.filter((id) => id !== user._id) : [...prev, user._id]
    );
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch {
      setLikes(post.likes);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText });
    setComments(data);
    setCommentText("");
  };

  const remove = async () => {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/posts/${post._id}`);
    onDelete?.(post._id);
  };

  return (
    <article className="card post">
      <header className="post-head">
        <Link to={`/u/${post.author?.username}`} className="post-author">
          <Avatar user={post.author} size={42} />
          <div>
            <div className="post-name">{post.author?.name}</div>
            <div className="post-meta">
              @{post.author?.username} · {timeAgo(post.createdAt)}
            </div>
          </div>
        </Link>
        {post.author?._id === user._id && (
          <button className="icon-btn" title="Delete" onClick={remove}>
            ✕
          </button>
        )}
      </header>

      <p className="post-text">{post.text}</p>

      {post.code && (
        <pre className="post-code">
          <code>{post.code}</code>
        </pre>
      )}

      <div className="post-actions">
        <button className={`action ${liked ? "liked" : ""}`} onClick={toggleLike}>
          {liked ? "♥" : "♡"} {likes.length}
        </button>
        <button className="action" onClick={() => setShowComments((s) => !s)}>
          💬 {comments.length}
        </button>
      </div>

      {showComments && (
        <div className="comments">
          {comments.map((c) => (
            <div key={c._id} className="comment">
              <Avatar user={c.author} size={28} />
              <div className="comment-body">
                <Link to={`/u/${c.author?.username}`} className="comment-name">
                  {c.author?.name}
                </Link>
                <span className="comment-text">{c.text}</span>
              </div>
            </div>
          ))}
          <form className="comment-form" onSubmit={submitComment}>
            <input
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" disabled={!commentText.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
