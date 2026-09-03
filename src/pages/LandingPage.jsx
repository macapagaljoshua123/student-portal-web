import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, Users2, BarChart3, ArrowRight } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import FadeInSection from "../components/FadeInSection";

const steps = [
  {
    title: "Admins create organizations",
    body: "The Dean & Coordinator open a new PSG organization in seconds and set its title and description.",
    icon: Building2,
  },
  {
    title: "Officers get provisioned",
    body: "Every seat — President, VPs, Secretary, Treasurer, Auditor, and Governors — is added with a role and a secure password sent straight to their inbox.",
    icon: Users2,
  },
  {
    title: "Everyone signs in safely",
    body: "First-time sign-in forces a fresh password, so temporary credentials never linger.",
    icon: ShieldCheck,
  },
  {
    title: "Leadership sees the full picture",
    body: "The Super Admin dashboard tracks organizations created and how roles are distributed across campus.",
    icon: BarChart3,
  },
];

const galleryCaptions = [
  "General Assembly, Second Semester",
  "PSG Officer Induction",
  "Org Fair — Booth Walkthrough",
  "Leadership Summit",
  "Community Outreach Day",
  "Year-End Recognition Night",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(201,162,39,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(201,162,39,0.15), transparent 40%)",
          }}
        />
        <div className="container-page relative grid gap-12 py-24 lg:grid-cols-[1.1fr,0.9fr] lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span id="what-is" className="inline-block rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gold-400">
              What is Student Government Portal
            </span>
            <h1 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              One record book for every student organization on campus.
            </h1>
            <p className="mt-6 max-w-lg text-white/70">
              Student Government Portal gives the Dean&apos;s Office, PSG
              officers, and every affiliated organization a shared,
              role-based home for memberships, credentials, and reporting —
              replacing scattered spreadsheets with one source of truth.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/signup" className="btn-gold">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              {/* FIX: text-white -> !text-white so it wins over .btn-outline's default navy text */}
              <Link
                to="/login"
                className="btn-outline border-white/25 !text-white hover:border-gold-400"
              >
                Log In
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
                Organizations Created
              </p>
              <div className="mt-4 flex items-end gap-3">
                {[38, 52, 47, 63, 58, 71].map((h, i) => (
                  <div key={i} className="flex-1">
                    <div
                      className="rounded-t-md bg-gradient-to-t from-gold-600 to-gold-400"
                      style={{ height: `${h * 1.6}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm">
                <div>
                  <p className="text-white/50">Organizations</p>
                  <p className="font-display text-2xl font-semibold">24</p>
                </div>
                <div>
                  <p className="text-white/50">Officers</p>
                  <p className="font-display text-2xl font-semibold">168</p>
                </div>
                <div>
                  <p className="text-white/50">Admins</p>
                  <p className="font-display text-2xl font-semibold">9</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="container-page">
          <FadeInSection>
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
              How it works
            </span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-navy-950 sm:text-4xl">
              From a blank organization to a fully staffed office.
            </h2>
          </FadeInSection>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <FadeInSection key={step.title} delay={i * 0.08}>
                <div className="card h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-navy-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-navy-900/60">{step.body}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Picture gallery */}
      <section id="pictures" className="bg-navy-900/[0.03] py-24">
        <div className="container-page">
          <FadeInSection>
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
              Pictures
            </span>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold text-navy-950 sm:text-4xl">
              Moments from the student government year.
            </h2>
          </FadeInSection>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryCaptions.map((caption, i) => (
              <FadeInSection key={caption} delay={(i % 3) * 0.08}>
                <div className="group overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-soft">
                  <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950 text-white/30">
                    <Users2 className="h-10 w-10" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-navy-900">{caption}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-950 py-20 text-white">
        <FadeInSection className="container-page flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="max-w-md text-3xl font-semibold sm:text-4xl">
              Ready to bring your organization on board?
            </h2>
            <p className="mt-3 max-w-md text-white/60">
              Admins can create your organization and provision officers in
              minutes.
            </p>
          </div>
          <Link to="/login" className="btn-gold">
            Log In to the Portal <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeInSection>
      </section>

      <PublicFooter />
    </div>
  );
}
