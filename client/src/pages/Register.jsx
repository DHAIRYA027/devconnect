import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in? Straight to the feed.
  if (user) return <Navigate to="/" replace />;

  const set = (key) => (e) => {
    // Usernames are lowercase by definition — normalize as the user types
    // so validation never trips on capitals or spaces.
    const value = key === "username" ? e.target.value.toLowerCase().replace(/\s+/g, "_") : e.target.value;
    setForm({ ...form, [key]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed — please try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <h2>Create your account</h2>
      <p className="auth-form-sub">Join the community — it takes less than a minute.</p>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={submit}>
        <div className="form-row">
          <div>
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={form.name}
              onChange={set("name")}
              required
            />
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              autoComplete="username"
              placeholder="ada_lovelace"
              value={form.username}
              onChange={set("username")}
              minLength={3}
              maxLength={20}
              required
            />
          </div>
        </div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set("email")}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={set("password")}
          minLength={6}
          required
        />
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
