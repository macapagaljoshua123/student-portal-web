import { useState } from "react";

/**
 * Prompt#1 3.1: "Set Create Organization Limit – Hover menu with Custom
 * (numeric input), Unlimited, and a Submit button."
 */
export default function OrgLimitSubmenu({ currentLimit, onSubmit, submitting }) {
  const [mode, setMode] = useState(currentLimit == null ? "unlimited" : "custom");
  const [value, setValue] = useState(currentLimit ?? 1);

  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-900/50">
        Create Organization Limit
      </p>

      <label className="flex items-center gap-2 text-sm text-navy-900">
        <input
          type="radio"
          name="limit-mode"
          checked={mode === "custom"}
          onChange={() => setMode("custom")}
          className="h-4 w-4 border-navy-900/30 text-gold-500 focus:ring-gold-500"
        />
        Custom
      </label>
      <input
        type="number"
        min={0}
        disabled={mode !== "custom"}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="field-input disabled:cursor-not-allowed disabled:bg-navy-900/5 disabled:text-navy-900/40"
      />

      <label className="flex items-center gap-2 text-sm text-navy-900">
        <input
          type="radio"
          name="limit-mode"
          checked={mode === "unlimited"}
          onChange={() => setMode("unlimited")}
          className="h-4 w-4 border-navy-900/30 text-gold-500 focus:ring-gold-500"
        />
        Unlimited
      </label>

      <button
        type="button"
        disabled={submitting}
        onClick={() => onSubmit(mode === "unlimited" ? null : value)}
        className="btn-primary w-full !py-2 text-xs"
      >
        {submitting ? "Saving..." : "Submit"}
      </button>
    </div>
  );
}
