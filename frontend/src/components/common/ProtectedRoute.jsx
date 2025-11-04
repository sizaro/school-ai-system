// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useData } from "../../context/DataContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useData();

  console.log("🔐 [ProtectedRoute] Checking user from context...");
  console.log("📦 Context user:", user);
  console.log("⏳ Loading state:", loading);

  // While the user is being fetched, show a loading message
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    );
  }

  // Only redirect if loading is finished and user is truly null
  if (!user) {
    console.warn("🚫 No logged-in user found — redirecting to home");
    return <Navigate to="/" replace />;
  }

  // Check role if required
  if (role && user.role !== role) {
    console.warn(
      `🚫 Role mismatch — required: ${role}, but user role is ${user.role}`
    );
    return <Navigate to="/" replace />;
  }

  console.log("✅ Access granted for user:", user.last_name, "Role:", user.role);
  return children;
};

export default ProtectedRoute;
