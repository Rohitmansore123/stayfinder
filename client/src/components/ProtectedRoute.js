import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute Component
 * Ensures that only authenticated users can access specific routes
 * If user is not authenticated, redirects to login page
 *
 * @param {Object} children - Component to render if authenticated
 * @param {Array} allowedRoles - Optional array of roles that can access this route
 */
function ProtectedRoute({ children, allowedRoles = null }) {
  const { user } = useAuth();
  const isAuthenticated = !!localStorage.getItem("token");

  // Not authenticated: redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but role check fails
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authenticated and either no role restriction or role matches
  return children;
}

export default ProtectedRoute;
