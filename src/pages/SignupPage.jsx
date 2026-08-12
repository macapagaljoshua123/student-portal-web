import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, Users2 } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function SignupPage() {
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
            Accounts are set up by your Admin
          </h1>
          <p className="mt-4 text-navy-900/60">
            To keep every organization&apos;s roster accurate, individual
            members don&apos;t self-register. Instead, your Dean & Coordinator
            (Admin) creates your organization and adds each officer directly.
            Here&apos;s how it works from there.
          </p>
        </motion.div>

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
