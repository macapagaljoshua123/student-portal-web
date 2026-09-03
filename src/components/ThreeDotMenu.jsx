import { useEffect, useRef, useState } from "react";
import { MoreVertical, ChevronRight } from "lucide-react";

/**
 * Reusable 3-dot dropdown for row-level actions.
 *
 * `items` is an array of:
 *   - { label, icon, danger?, onClick }                      -> plain action
 *   - { label, icon, submenu: <ReactNode> }                   -> hover submenu
 *
 * Used for: Prompt#1 3.1 "Manage Admin Organization Limits" (Delete Account /
 * Set Create Organization Limit) and 3.2 "Member Management" (Delete User).
 */
export default function ThreeDotMenu({ items, label = "Open actions menu" }) {
  const [open, setOpen] = useState(false);
  const [submenuFor, setSubmenuFor] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSubmenuFor(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        className="rounded-full p-1.5 text-navy-900/50 hover:bg-navy-900/5 hover:text-navy-900"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-56 overflow-visible rounded-xl border border-navy-900/10 bg-white py-1.5 shadow-soft">
          {items.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.submenu && setSubmenuFor(item.label)}
              onMouseLeave={() => item.submenu && setSubmenuFor(null)}
            >
              <button
                type="button"
                onClick={() => {
                  if (item.submenu) return;
                  item.onClick?.();
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm hover:bg-navy-900/5 ${
                  item.danger ? "text-red-600" : "text-navy-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </span>
                {item.submenu && <ChevronRight className="h-3.5 w-3.5 text-navy-900/30" />}
              </button>

              {item.submenu && submenuFor === item.label && (
                <div className="absolute right-full top-0 mr-1 w-64 rounded-xl border border-navy-900/10 bg-white p-4 shadow-soft">
                  {item.submenu}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
