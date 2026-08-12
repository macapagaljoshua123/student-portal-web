// Real, minimal SVG marks for each platform (drawn as simplified logo glyphs,
// not copied bitmap assets) so the footer can render actual recognizable icons.

export function EmailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 6.5L12 13L20 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14 8.5h-1.4c-.6 0-1.1.5-1.1 1.1V11h2.4l-.3 2.3h-2.1V19h-2.3v-5.7H9V11h1.2V9.4c0-1.7 1.2-2.9 2.9-2.9H14v2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.5 8.4c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4.2.5.6 1.5.7 1.6.1.1.1.3 0 .5-.1.2-.2.3-.4.5-.1.2-.3.3-.1.6.2.4.9 1.4 2 2.3 1.4 1.1 2.1 1.2 2.3 1.1.2-.1.4-.3.6-.6.2-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.4.1.3 0 1.1-.4 1.5-.4.4-1.4.8-2.4.5-1.1-.3-3-1-4.4-2.5-1.2-1.2-2-2.6-2.3-3.6-.3-1 0-1.7.3-2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="6.5" y="10" width="2" height="7.5" fill="currentColor" />
      <circle cx="7.5" cy="7" r="1.2" fill="currentColor" />
      <path
        d="M11 17.5V10h2v1c.4-.6 1.2-1.2 2.3-1.2 1.9 0 2.9 1.2 2.9 3.4v4.3h-2v-4c0-1.1-.4-1.8-1.4-1.8-.8 0-1.3.5-1.5 1-.1.2-.1.5-.1.8v4h-2Z"
        fill="currentColor"
      />
    </svg>
  );
}
