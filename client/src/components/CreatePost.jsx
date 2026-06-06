import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

// Composer for a new post, with an optional code snippet toggle.
export default function CreatePost({ onPost }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      const { data } = await api.post("/posts", {
        text,
        code: showCode ? code : "",
        language: showCode ? "javascript" : "",
      });
      onPost?.(data);
      setText("");
      setCode("");
      setShowCode(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card create-post" onSubmit={submit}>
      <div className="create-post-top">
        <Avatar user={user} size={42} />
        <textarea
          placeholder={`What are you building, ${user?.name?.split(" ")[0]}?`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          maxLength={1000}
        />
      </div>

      {showCode && (
        <textarea
          className="code-input"
          placeholder="// paste a code snippet"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={4}
        />
      )}

      <div className="create-post-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setShowCode((s) => !s)}
        >
          {showCode ? "Remove code" : "</> Add code"}
        </button>
        <button className="btn btn-primary" disabled={!text.trim() || busy}>
          {busy ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
