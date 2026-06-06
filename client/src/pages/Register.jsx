import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="brand brand-lg">
          &lt;Dev<span>Connect</span>/&gt;
        </h1>
        <p className="auth-sub">Join the community.</p>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit}>
          <label>Full name</label>
          <input value={form.name} onChange={set("name")} required />
          <label>Username</label>
          <input
            value={form.username}
            onChange={set("username")}
            placeholder="lowercase, no spaces"
            required
          />
          <label>Email</label>
          <input type="email" value={form.email} onChange={set("email")} required />
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="at least 6 characters"
            required
          />
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
