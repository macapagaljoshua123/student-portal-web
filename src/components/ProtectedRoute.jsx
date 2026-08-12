import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.must_reset_password) {
    return <Navigate to="/reset-password" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.account_type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
