import { useEffect, useRef, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Renders the official Google "Sign in with Google" button via Google
 * Identity Services (https://accounts.google.com/gsi/client, loaded in
 * index.html) and forwards the resulting ID token to `onCredential`.
 *
 * Requirements doc ref: Prompt#1 section 2 (Google Auth) & 5.1 (Use Google
 * OAuth for sign-in).
 */
export default function GoogleSignInButton({ onCredential, text = "signin_with", disabled }) {
  const buttonRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function tryInit() {
      if (cancelled) return;
      if (!window.google?.accounts?.id) {
        // gsi script loads async; poll briefly until it's available
        setTimeout(tryInit, 150);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      });
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: 320,
          text,
        });
      }
      setScriptReady(true);
    }

    if (CLIENT_ID && !disabled) tryInit();
    return () => {
      cancelled = true;
    };
  }, [onCredential, text, disabled]);

  if (!CLIENT_ID) {
    return (
      <div className="rounded-xl border border-dashed border-navy-900/20 bg-navy-900/[0.03] px-4 py-3 text-center text-xs text-navy-900/50">
        Google sign-in isn&apos;t configured yet. Set{" "}
        <code className="rounded bg-navy-900/10 px-1 py-0.5">VITE_GOOGLE_CLIENT_ID</code> to
        enable it.
      </div>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-50" : ""}>
      <div ref={buttonRef} />
      {!scriptReady && (
        <p className="mt-2 text-center text-xs text-navy-900/40">Loading Google sign-in…</p>
      )}
    </div>
  );
}
