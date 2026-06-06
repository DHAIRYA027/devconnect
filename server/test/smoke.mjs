// Lightweight end-to-end smoke test. Assumes the API is already running at
// API_URL (default http://localhost:5050). Exercises the core auth + post
// flow and exits non-zero on any failure — perfect for CI.
const API = process.env.API_URL || "http://localhost:5050";
const rand = Math.random().toString(36).slice(2, 8);

let passed = 0;
const check = (name, cond) => {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    console.error(`  ✗ ${name}`);
    process.exitCode = 1;
    throw new Error(`Smoke test failed: ${name}`);
  }
};

const run = async () => {
  // 1. Health
  const health = await fetch(`${API}/api/health`).then((r) => r.json());
  check("health endpoint returns ok", health.status === "ok");

  // 2. Register
  const reg = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "CI Bot",
      username: `ci_${rand}`,
      email: `ci_${rand}@test.dev`,
      password: "password123",
    }),
  }).then((r) => r.json());
  check("register returns a JWT", typeof reg.token === "string");

  const auth = { Authorization: `Bearer ${reg.token}`, "Content-Type": "application/json" };

  // 3. Authenticated request
  const me = await fetch(`${API}/api/auth/me`, { headers: auth }).then((r) => r.json());
  check("auth/me returns the user", me.user?.username === `ci_${rand}`);

  // 4. Create a post
  const post = await fetch(`${API}/api/posts`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ text: "hello from CI" }),
  }).then((r) => r.json());
  check("create post succeeds", post._id && post.text === "hello from CI");

  // 5. Like the post (toggles on)
  const like = await fetch(`${API}/api/posts/${post._id}/like`, {
    method: "POST",
    headers: auth,
  }).then((r) => r.json());
  check("like toggles on", like.liked === true);

  // 6. Unauthenticated request is rejected
  const unauth = await fetch(`${API}/api/posts/feed`);
  check("protected route rejects missing token", unauth.status === 401);

  console.log(`\n✅ All ${passed} smoke checks passed.`);
};

run().catch((err) => {
  console.error("\n❌ Smoke test error:", err.message);
  process.exit(1);
});
