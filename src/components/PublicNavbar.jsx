import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#what-is", label: "What is Student Government Portal" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pictures", label: "Pictures" },
  { href: "#contact", label: "Contact Us" },
  { href: "#about", label: "About Us" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 backdrop-blur">
      <nav className="container-page flex h-20 items-center justify-between" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 font-display text-base font-semibold text-navy-950">
            SG
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Student Government Portal
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-white/70 transition hover:text-gold-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {/* FIX: text-white -> !text-white so it wins over .btn-outline's default navy text */}
          <Link
            to="/login"
            className="btn-outline border-white/25 !text-white hover:border-gold-400"
          >
            Log In
          </Link>
          <Link to="/signup" className="btn-gold">
            Sign Up
          </Link>
        </div>

        <button
          className="text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-navy-950 px-6 pb-6 lg:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-white/80"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3">
            {/* FIX: text-white -> !text-white */}
            <Link to="/login" className="btn-outline flex-1 border-white/25 !text-white">
              Log In
            </Link>
            <Link to="/signup" className="btn-gold flex-1">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
