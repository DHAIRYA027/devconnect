import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import PostCard from "../components/PostCard.jsx";

export default function Profile() {
  const { username } = useParams();
  const { user: me, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/users/${username}`),
      api.get(`/posts/user/${username}`),
    ])
      .then(([p, ps]) => {
        setProfile(p.data);
        setPosts(ps.data);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="card muted layout-narrow">Loading profile…</div>;
  if (!profile) return <div className="card empty layout-narrow">User not found.</div>;

  const isMe = me._id === profile._id;
  const isFollowing = profile.followers?.some((f) => f._id === me._id || f === me._id);

  const toggleFollow = async () => {
    await api.post(`/users/${profile._id}/follow`);
    // Update both the viewed profile and my own following list.
    setProfile((prev) => ({
      ...prev,
      followers: isFollowing
        ? prev.followers.filter((f) => (f._id || f) !== me._id)
        : [...prev.followers, { _id: me._id, name: me.name, username: me.username }],
    }));
    setUser({
      ...me,
      following: isFollowing
        ? me.following.filter((id) => id !== profile._id)
        : [...me.following, profile._id],
    });
  };

  return (
    <div className="layout-narrow">
      <div className="card profile-header">
        <Avatar user={profile} size={88} />
        <div className="profile-info">
          <h2>{profile.name}</h2>
          <div className="post-meta">@{profile.username}</div>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          <div className="profile-stats">
            <span>
              <strong>{posts.length}</strong> posts
            </span>
            <span>
              <strong>{profile.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{profile.following?.length || 0}</strong> following
            </span>
          </div>

          {profile.skills?.length > 0 && (
            <div className="skill-tags">
              {profile.skills.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="profile-actions">
            {isMe ? (
              <Link to="/settings" className="btn btn-ghost">
                Edit profile
              </Link>
            ) : (
              <button
                className={`btn ${isFollowing ? "btn-ghost" : "btn-primary"}`}
                onClick={toggleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
            {profile.githubUrl && (
              <a
                className="btn btn-ghost"
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="card empty">No posts yet.</div>
      ) : (
        posts.map((p) => (
          <PostCard
            key={p._id}
            post={p}
            onDelete={(id) => setPosts((prev) => prev.filter((x) => x._id !== id))}
          />
        ))
      )}
    </div>
  );
}
