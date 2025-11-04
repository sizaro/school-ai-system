// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useData } from "../../context/DataContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useData();

  console.log("🔐 [ProtectedRoute] Checking user from context...");
  console.log("📦 Context user:", user);
  console.log("⏳ Loading state:", loading);

  if (loading) {
    console.log("⏳ Still loading user info...");
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    );
  }

  if (!user) {
    console.warn("🚫 No logged-in user found — redirecting to home");
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    console.warn(
      `🚫 Role mismatch — required: ${role}, but user role is ${user.role}`
    );
    return <Navigate to="/" replace />;
  }

  console.log("✅ Access granted for user:", user.username, "Role:", user.role);
  return children;
};

export default ProtectedRoute;
