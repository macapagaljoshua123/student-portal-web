export default function StatusBadge({ online, showLabel = true }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-navy-900/25"}`}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={online ? "text-emerald-700" : "text-navy-900/40"}>
          {online ? "Online" : "Offline"}
        </span>
      )}
    </span>
  );
}
