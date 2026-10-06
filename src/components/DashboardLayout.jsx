import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Building2,
  ListTree,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  UserCircle2,
  ShieldCheck,
  Activity,
  ClipboardList,
  ListChecks,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePresenceHeartbeat } from "../hooks/usePresence";
import NotificationBell from "./NotificationBell";

const NAV_ITEMS = {
  super_admin: [
    { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/dashboard/organizations", label: "Organization", icon: Building2 },
    { to: "/dashboard/organizations", label: "List of Organizations", icon: ListTree, exact: true },
    { to: "/dashboard/admins", label: "Admins", icon: ShieldCheck },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  // Free/Pro tier sidebar per Prompt#1 2.1 (Analytics, Organization, Settings, Logout)
  admin: [
    { to: "/dashboard/activity", label: "Analytics", icon: Activity },
    { to: "/dashboard/organizations", label: "Organization", icon: Building2 },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  adviser: [
    { to: "/dashboard/adviser-analytics", label: "Analytics", icon: Activity },
    { to: "/dashboard/organizations", label: "List of Organization", icon: ListTree },
    { to: "/dashboard/task-board", label: "PSG Task Board", icon: ClipboardList },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  member: [
    { to: "/dashboard/my-tasks", label: "My Tasks", icon: ListChecks },
    { to: "/dashboard/profile", label: "My Profile", icon: UserCircle2 },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  pio: [
    { to: "/dashboard/pio", label: "PIO Dashboard", icon: Megaphone },
    { to: "/dashboard/profile", label: "My Profile", icon: UserCircle2 },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
};
NAV_ITEMS.co_admin = NAV_ITEMS.member;

function navKeyFor(user) {
  if (user?.org_role === "PIO") return "pio";
  return user?.account_type;
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Desktop-only: collapse the sidebar down to icons. Remembered between visits.
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sgp_sidebar_collapsed") === "1");

  useEffect(() => {
    localStorage.setItem("sgp_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  usePresenceHeartbeat(Boolean(user));

  const items = NAV_ITEMS[navKeyFor(user)] || [];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-navy-900/[0.02]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-navy-900/10 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="text-navy-900 lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 font-display text-sm font-semibold text-gold-400">
              SG
            </span>
            <span className="hidden font-display text-base font-semibold text-navy-950 sm:inline">
              Student Government Dashboard
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-navy-900/10 py-1 pl-1 pr-3"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 text-navy-900">
                <UserCircle2 className="h-5 w-5" />
              </span>
              <span className="hidden text-sm font-medium text-navy-900 sm:inline">
                {user?.full_name}
              </span>
              <ChevronDown className="h-4 w-4 text-navy-900/50" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-navy-900/10 bg-white shadow-soft">
                <NavLink
                  to="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-900 hover:bg-navy-900/5"
                >
                  <Settings className="h-4 w-4" /> Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } ${
            collapsed ? "lg:w-[4.5rem]" : "lg:w-64"
          } fixed inset-y-16 left-0 z-30 w-64 shrink-0 border-r border-navy-900/10 bg-white p-4 transition-[width] duration-200 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)]`}
        >
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={`mb-3 hidden w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-900/50 hover:bg-navy-900/5 hover:text-navy-900 lg:flex ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed && "Collapse"}
          </button>
          <nav className="flex flex-col gap-1">
            {items.map((item, idx) => (
              <NavLink
                key={item.label + idx}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    collapsed ? "lg:justify-center lg:px-0" : ""
                  } ${
                    isActive
                      ? "bg-navy-900 text-white"
                      : "text-navy-900/70 hover:bg-navy-900/5 hover:text-navy-900"
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              title={collapsed ? "Log out" : undefined}
              className={`mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 ${
                collapsed ? "lg:justify-center lg:px-0" : ""
              }`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className={collapsed ? "lg:hidden" : ""}>Log out</span>
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
