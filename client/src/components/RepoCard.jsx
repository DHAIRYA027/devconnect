import { GithubIcon } from "./Icons.jsx";

// Small sidebar card pointing visitors to the source code.
export default function RepoCard() {
  return (
    <a
      className="card repo-card"
      href="https://github.com/DHAIRYA027/devconnect"
      target="_blank"
      rel="noreferrer"
    >
      <span className="repo-icon">
        <GithubIcon width={19} height={19} />
      </span>
      <span className="repo-text">
        <strong>Open source</strong>
        <span className="repo-sub">Browse the code on GitHub</span>
      </span>
    </a>
  );
}
