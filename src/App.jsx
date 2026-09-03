import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import AdminAnalyticsPage from "./pages/dashboard/AdminAnalyticsPage";
import AdminsPage from "./pages/dashboard/AdminsPage";
import OrganizationsPage from "./pages/dashboard/OrganizationsPage";
import OrganizationDetailPage from "./pages/dashboard/OrganizationDetailPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProfileViewPage from "./pages/dashboard/ProfileViewPage";

const DASHBOARD_ROUTES = {
  super_admin: "/dashboard/analytics",
  admin: "/dashboard/organizations",
  co_admin: "/dashboard/profile",
  member: "/dashboard/profile",
};

function RootRedirect() {
  
  return <LandingPage />;
}

function ResetPasswordGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/reset-password"
            element={
              <ResetPasswordGuard>
                <ResetPasswordPage />
              </ResetPasswordGuard>
            }
          />

          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admins"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <AdminsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/activity"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/organizations"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
                <OrganizationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/organizations/:orgId"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
                <OrganizationDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin", "co_admin", "member"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={["co_admin", "member"]}>
                <ProfileViewPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export { DASHBOARD_ROUTES };
