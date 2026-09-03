import { useState } from "react";
import { X, Check, Mail, Sparkles } from "lucide-react";

const FREE_FEATURES = ["Analytics", "Organization", "Settings", "Logout"];

/**
 * Prompt#1 section 2.1/2.2: on Google sign-up, ask the user to choose a
 * Free or Pro tier. Free proceeds immediately; Pro tells them to contact
 * the Super Admin and does not complete sign-up on its own.
 */
export default function TierSelectionModal({ onClose, onSelectFree, onSelectPro }) {
  const [choice, setChoice] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy-950">
            Choose your plan
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-4 w-4 text-navy-900/40" />
          </button>
        </div>
        <p className="mt-1 text-sm text-navy-900/60">
          Select how you&apos;d like to use the Student Government Portal.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setChoice("free")}
            className={`rounded-2xl border p-4 text-left transition ${
              choice === "free"
                ? "border-gold-500 ring-2 ring-gold-500/30"
                : "border-navy-900/10 hover:border-navy-900/30"
            }`}
          >
            <p className="font-display text-base font-semibold text-navy-950">Free Tier</p>
            <p className="mt-1 text-xs text-navy-900/50">Sign in with Google and get going right away.</p>
            <ul className="mt-3 space-y-1.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-navy-900/70">
                  <Check className="h-3.5 w-3.5 text-gold-600" /> {f}
                </li>
              ))}
            </ul>
          </button>

          <button
            type="button"
            onClick={() => setChoice("pro")}
            className={`rounded-2xl border p-4 text-left transition ${
              choice === "pro"
                ? "border-gold-500 ring-2 ring-gold-500/30"
                : "border-navy-900/10 hover:border-navy-900/30"
            }`}
          >
            <p className="flex items-center gap-1.5 font-display text-base font-semibold text-navy-950">
              <Sparkles className="h-4 w-4 text-gold-600" /> Pro Tier
            </p>
            <p className="mt-1 text-xs text-navy-900/50">
              Manually approved by the Super Admin, same dashboard features.
            </p>
          </button>
        </div>

        {choice === "pro" && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-gold-500/10 px-4 py-3 text-sm text-navy-900">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
            <p>Contact Super Admin for approval. They&apos;ll manually add your account to an organization.</p>
          </div>
        )}

        <button
          type="button"
          disabled={!choice}
          onClick={() => (choice === "free" ? onSelectFree() : onSelectPro())}
          className="btn-gold mt-6 w-full"
        >
          {choice === "pro" ? "Got it, I'll reach out" : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}
