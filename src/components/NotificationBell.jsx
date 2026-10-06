import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import apiClient from "../api/client";
import { useToast } from "../context/ToastContext";

function timeAgo(iso) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);
  const lastUnread = useRef(null);

  const load = useCallback(() => {
    apiClient
      .get("/notifications")
      .then(({ data }) => {
        setItems(data.items || []);
        setUnread(data.unread_count || 0);
        // Pop a toast when something new arrives while the page is open.
        if (lastUnread.current !== null && data.unread_count > lastUnread.current && data.items?.[0]) {
          notify(data.items[0].title);
        }
        lastUnread.current = data.unread_count || 0;
      })
      .catch(() => {});
  }, [notify]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    window.addEventListener("focus", load);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", load);
    };
  }, [load]);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleClick(n) {
    if (!n.is_read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      setUnread((u) => Math.max(0, u - 1));
      lastUnread.current = Math.max(0, (lastUnread.current ?? 1) - 1);
      apiClient.post(`/notifications/${n.id}/read`).catch(() => {});
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  }

  async function markAll() {
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
    setUnread(0);
    lastUnread.current = 0;
    apiClient.post("/notifications/read-all").catch(() => {});
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative text-navy-900/70 hover:text-navy-900"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-navy-950">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-navy-900/10 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-navy-900/10 px-4 py-3">
            <p className="text-sm font-semibold text-navy-950">Notifications</p>
            {unread > 0 && (
              <button
                onClick={markAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-navy-900/60 hover:text-navy-900"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-navy-900/40">You&apos;re all caught up.</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-3 border-b border-navy-900/5 px-4 py-3 text-left last:border-0 hover:bg-navy-900/[0.04] ${
                    n.is_read ? "" : "bg-gold-500/[0.07]"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.is_read ? "bg-transparent" : "bg-gold-500"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-navy-950">{n.title}</span>
                    {n.message && <span className="mt-0.5 block text-xs text-navy-900/60">{n.message}</span>}
                    <span className="mt-1 block text-[11px] text-navy-900/40">{timeAgo(n.created_at)}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
