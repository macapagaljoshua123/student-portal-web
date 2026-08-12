import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DASHBOARD_ROUTES = {
  super_admin: "/dashboard/analytics",
  admin: "/dashboard/organizations",
  co_admin: "/dashboard/profile",
  member: "/dashboard/profile",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.must_reset_password) {
        navigate("/reset-password");
      } else {
        navigate(DASHBOARD_ROUTES[userData.account_type] || "/dashboard/profile");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(201,162,39,0.3), transparent 45%)",
          }}
        />
        <Link to="/" className="relative flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 font-display text-base font-semibold text-navy-950">
            SG
          </span>
          <span className="font-display text-lg font-semibold">Student Government Portal</span>
        </Link>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-md font-display text-2xl font-medium leading-snug"
        >
          &ldquo;Every organization, every officer, every record &mdash; in one
          place, kept in order.&rdquo;
        </motion.blockquote>
        <p className="relative text-sm text-white/50">
          For Admins, Co-Admins, and PSG Members with an existing account.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-display text-base font-semibold text-gold-400">
              SG
            </span>
            <span className="font-display text-lg font-semibold text-navy-950">
              Student Government Portal
            </span>
          </Link>

          <h1 className="text-2xl font-semibold text-navy-950">Welcome back</h1>
          <p className="mt-2 text-sm text-navy-900/60">
            Log in with the credentials your Admin provided.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="field-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu"
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-900/50">
            New organization?{" "}
            <Link to="/signup" className="font-semibold text-navy-900 hover:text-gold-600">
              See how to get set up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
