import apiClient from "../api/client";

export function avatarUrl(user) {
  if (!user?.id || !user?.avatar_version) return null;
  return `${apiClient.defaults.baseURL}/auth/avatar/${user.id}?v=${user.avatar_version}`;
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** Profile picture, falling back to the person's initials. */
export default function Avatar({ user, size = 32, className = "" }) {
  const url = avatarUrl(user);
  const style = { width: size, height: size, fontSize: Math.max(10, size * 0.38) };
  if (url) {
    return (
      <img
        src={url}
        alt={user?.full_name || "Profile"}
        style={style}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      style={style}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gold-500/25 font-semibold text-navy-900 ${className}`}
      aria-hidden="true"
    >
      {initials(user?.full_name)}
    </span>
  );
}
