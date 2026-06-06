import { initials } from "../utils/format.js";

// Shows the user's avatar image, or their initials on a colored circle.
export default function Avatar({ user, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.4 };
  if (user?.avatar) {
    return <img className="avatar" src={user.avatar} alt={user.name} style={style} />;
  }
  return (
    <div className="avatar avatar-fallback" style={style}>
      {initials(user?.name)}
    </div>
  );
}
