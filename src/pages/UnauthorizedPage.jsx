import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900/[0.02] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-navy-950">Access restricted</h1>
      <p className="mt-2 max-w-sm text-sm text-navy-900/60">
        Your account doesn&apos;t have permission to view this page.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
