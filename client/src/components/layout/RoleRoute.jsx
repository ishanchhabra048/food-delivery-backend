import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect to proper role home
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "restaurantOwner") {
      return <Navigate to="/owner" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
