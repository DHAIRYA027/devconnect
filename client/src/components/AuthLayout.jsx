import { UsersIcon, ZapIcon, BellIcon, GithubIcon } from "./Icons.jsx";

const FEATURES = [
  {
    icon: <ZapIcon />,
    title: "Share your work",
    text: "Post updates with code snippets that look great.",
  },
  {
    icon: <UsersIcon />,
    title: "Follow builders",
    text: "A personalized feed from the developers you follow.",
  },
  {
    icon: <BellIcon />,
    title: "Real-time activity",
    text: "Likes, comments and follows arrive instantly.",
  },
];

// Two-panel auth shell: product pitch on the left, the form on the right.
// On small screens the hero collapses and only the form shows.
export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-hero">
          <div className="brand brand-hero">
            &lt;Dev<span>Connect</span>/&gt;
          </div>
          <h1 className="auth-tagline">
            Where developers share what they&rsquo;re building.
          </h1>
          <ul className="auth-features">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <a
            className="auth-source"
            href="https://github.com/DHAIRYA027/devconnect"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon /> View the source on GitHub
          </a>
        </aside>

        <section className="auth-form-side">
          <div className="brand auth-mobile-brand">
            &lt;Dev<span>Connect</span>/&gt;
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
