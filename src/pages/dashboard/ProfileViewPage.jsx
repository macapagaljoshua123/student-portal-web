import { UserCircle2, Sparkles } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

const ROLE_LABELS = {
  co_admin: "Co-Admin",
  member: "PSG Member",
};

export default function ProfileViewPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-900 text-gold-400">
          <UserCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-navy-950">{user?.full_name}</h1>
        <p className="mt-1 text-sm text-navy-900/60">
          {ROLE_LABELS[user?.account_type] || "Member"}
          {user?.org_role ? ` · ${user.org_role}` : ""}
        </p>
        <div className="mt-2 flex justify-center">
          {/* You're viewing this page, so you're online by definition. */}
          <StatusBadge online />
        </div>

        <div className="card mt-8 text-left">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-navy-900/5 pb-3">
              <dt className="text-navy-900/50">Email</dt>
              <dd className="font-medium text-navy-900">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-900/50">Role</dt>
              <dd className="font-medium text-navy-900">{user?.org_role || "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="card mt-6 flex items-start gap-3 text-left">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
          <div>
            <p className="font-medium text-navy-900">Your dashboard is on its way</p>
            <p className="mt-1 text-sm text-navy-900/60">
              A full Co-Admin & Member dashboard experience is being designed.
              For now, this profile view confirms your account and role are
              set up correctly.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
