import { EmailIcon, FacebookIcon, InstagramIcon, WhatsAppIcon, LinkedInIcon } from "./SocialIcons";

const socials = [
  { Icon: EmailIcon, label: "Email", href: "mailto:studentgov@campus.edu" },
  { Icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { Icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { Icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/10000000000" },
  { Icon: LinkedInIcon, label: "LinkedIn", href: "https://linkedin.com" },
];

export default function PublicFooter() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-navy-950 text-white">
      <div className="container-page grid gap-10 py-16 lg:grid-cols-3">
        <div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 font-display text-base font-semibold text-navy-950">
            SG
          </span>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            One home for every organization in student government &mdash;
            memberships, roles, and records, kept in order.
          </p>
        </div>

        <div id="about">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">About Us</h3>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            The Student Government Portal supports the Dean&apos;s Office, the
            PSG President, and every officer beneath them with a single
            source of truth for organizations and membership records.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">
            Contact Us
          </h3>
          <p className="mt-4 text-sm text-white/60">studentgov@campus.edu</p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-gold-400 hover:text-gold-400"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <p className="container-page text-xs text-white/40">
          &copy; {new Date().getFullYear()} Student Government Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
