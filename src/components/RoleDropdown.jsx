import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export const PSG_ROLES = [
  { value: "President", accountType: "co_admin" },
  { value: "VP Internal", accountType: "member" },
  { value: "VP External", accountType: "member" },
  { value: "VP Sports", accountType: "member" },
  { value: "Secretary", accountType: "member" },
  { value: "Treasurer", accountType: "member" },
  { value: "Auditor", accountType: "member" },
  { value: "BMA Governor", accountType: "member" },
  { value: "EDUC SOC Governor", accountType: "member" },
];

export default function RoleDropdown({ value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className="field-input flex items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-navy-900" : "text-navy-900/40"}>
          {value || "Select a role"}
        </span>
        <ChevronDown className="h-4 w-4 text-navy-900/40" />
      </button>

      {open && (
        <ul
          role="listbox"
          onMouseLeave={() => setOpen(false)}
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-navy-900/10 bg-white shadow-soft"
        >
          {PSG_ROLES.map((role) => (
            <li key={role.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === role.value}
                onClick={() => {
                  onChange(role.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-navy-900 hover:bg-navy-900/5"
              >
                {role.value}
                {value === role.value && <Check className="h-4 w-4 text-gold-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
