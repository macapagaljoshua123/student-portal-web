import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, Users2 } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import GoogleSignInButton from "../components/GoogleSignInButton";
import TierSelectionModal from "../components/TierSelectionModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { DASHBOARD_ROUTES } from "../App";

export default function SignupPage() {
  const { signupWithGoogle } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [showTierModal, setShowTierModal] = useState(false);
  const [pendingCredential, setPendingCredential] = useState(null);
  const [error, setError] = useState("");

  // Step 1: capture the Google credential, then ask which tier to join.
  function handleGoogleCredential(idToken) {
    setError("");
    setPendingCredential(idToken);
    setShowTierModal(true);
  }

  // Step 2a: Free tier completes sign-up right away.
  async function handleSelectFree() {
    try {
      const userData = await signupWithGoogle(pendingCredential, "free");
      setShowTierModal(false);
      navigate(DASHBOARD_ROUTES[userData.account_type] || "/dashboard/profile");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not sign up with Google.");
      setShowTierModal(false);
    }
  }

  // Step 2b: Pro tier is a request for the Super Admin, not an instant account.
  async function handleSelectPro() {
    try {
      await signupWithGoogle(pendingCredential, "pro");
      notify("Contact Super Admin for approval. We've flagged your request.", {
        icon: "mail",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Could not submit Pro tier request.");
    } finally {
      setShowTierModal(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="container-page py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gold-600">
            Getting started
          </span>
          <h1 className="mt-5 text-3xl font-semibold text-navy-950 sm:text-4xl">
            Sign up with Google, or get added by your Admin
          </h1>
          <p className="mt-4 text-navy-900/60">
            Signing in with Google lets you choose a Free or Pro tier on the
            spot. Prefer not to use Google? Your Dean & Coordinator (Admin)
            can also create your organization and add each officer directly.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-sm">
          <div className="card flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-medium text-navy-900">Continue with Google</p>
            <GoogleSignInButton onCredential={handleGoogleCredential} text="signup_with" />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>

        {showTierModal && (
          <TierSelectionModal
            onClose={() => setShowTierModal(false)}
            onSelectFree={handleSelectFree}
            onSelectPro={handleSelectPro}
          />
        )}

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: Users2,
              title: "1. Admin adds you",
              body: "Your Admin creates your account with your name, email, and PSG role.",
            },
            {
              icon: Mail,
              title: "2. Check your inbox",
              body: "A temporary password arrives by email, sent through the portal.",
            },
            {
              icon: ShieldCheck,
              title: "3. Set your password",
              body: "Your first login prompts you to choose a new password before entering your dashboard.",
            },
          ].map((step) => (
            <div key={step.title} className="card text-left">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-navy-900/60">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-navy-900/10 bg-navy-900/[0.03] p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-navy-950">
            Representing a new organization?
          </h2>
          <p className="mt-2 text-sm text-navy-900/60">
            Reach out to the Dean & Coordinator's office to have your
            organization created on the portal.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="mailto:studentgov@campus.edu" className="btn-gold">
              <Mail className="h-4 w-4" /> Email Student Government
            </a>
            <Link to="/login" className="btn-outline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
