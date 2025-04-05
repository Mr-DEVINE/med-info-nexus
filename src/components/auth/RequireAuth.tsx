
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  adminOnly?: boolean;
}

const RequireAuth = ({ children, allowedRoles, adminOnly = false }: RequireAuthProps) => {
  const { isAuthenticated, role } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin can access everything
  if (role === "admin") {
    return <>{children}</>;
  }

  // For admin-only routes, redirect non-admin users
  if (adminOnly) {
    return <Navigate to="/dashboard" replace />;
  }

  // Regular role-based access control
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
