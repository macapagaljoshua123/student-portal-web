import { motion } from "framer-motion";

/**
 * "Health bar" style progress meter. Fills green as tasks get completed.
 * `segments` draws one tick per task so 5 tasks = 5 chunks (20% each).
 */
export default function ProgressBar({ percent = 0, segments = 0, size = "md", showLabel = true }) {
  const pct = Math.max(0, Math.min(100, percent));
  const h = size === "lg" ? "h-4" : size === "sm" ? "h-2" : "h-3";
  const ticks = segments > 1 && segments <= 20 ? segments - 1 : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative ${h} flex-1 overflow-hidden rounded-full bg-navy-900/10`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {Array.from({ length: ticks }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 h-full w-px bg-white/80"
            style={{ left: `${((i + 1) / segments) * 100}%` }}
          />
        ))}
      </div>
      {showLabel && (
        <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-navy-900">
          {pct}%
        </span>
      )}
    </div>
  );
}
