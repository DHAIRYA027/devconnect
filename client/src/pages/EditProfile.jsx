import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
    githubUrl: user.githubUrl || "",
    skills: (user.skills || []).join(", "),
  });
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const { data } = await api.put("/users/me", payload);
      setUser(data.user);
      navigate(`/u/${user.username}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="layout-narrow">
      <div className="card">
        <h2 className="page-title">Edit profile</h2>
        <form onSubmit={submit}>
          <label>Name</label>
          <input value={form.name} onChange={set("name")} />
          <label>Bio</label>
          <textarea value={form.bio} onChange={set("bio")} rows={3} maxLength={200} />
          <label>Avatar URL</label>
          <input value={form.avatar} onChange={set("avatar")} placeholder="https://…" />
          <label>GitHub URL</label>
          <input value={form.githubUrl} onChange={set("githubUrl")} placeholder="https://github.com/…" />
          <label>Skills (comma separated)</label>
          <input value={form.skills} onChange={set("skills")} placeholder="React, Node.js, MongoDB" />
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
