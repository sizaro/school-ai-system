// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const ProtectedRoute = ({ children, role }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    const fetchAuth = async () => {
      console.log("🔍 [ProtectedRoute] Starting /auth/check request...");

      try {
        console.log("🌐 Request URL:", `${API_URL}/auth/check`);

        const res = await axios.get(`${API_URL}/auth/check`, {
          withCredentials: true, // must include to send cookies
        });

        console.log("✅ [ProtectedRoute] Auth check response:", res.data);

        setAuthState({
          loading: false,
          user: res.data.user || null,
        });
      } catch (err) {
        console.error("❌ [ProtectedRoute] Auth check failed:", err);
        if (err.response) {
          console.error("🧱 Server responded with:", err.response.status, err.response.data);
        } else {
          console.error("⚠️ Network or CORS issue:", err.message);
        }
        setAuthState({ loading: false, user: null });
      }
    };

    fetchAuth();
  }, []);

  if (authState.loading) {
    console.log("⏳ [ProtectedRoute] Still loading auth check...");
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    );
  }

  if (!authState.user) {
    console.warn("🚫 [ProtectedRoute] No user — redirecting to home");
    return <Navigate to="/" replace />;
  }

  if (role && authState.user.role !== role) {
    console.warn(
      `🚫 [ProtectedRoute] Role mismatch — required: ${role}, got: ${authState.user.role}`
    );
    return <Navigate to="/" replace />;
  }

  console.log("✅ [ProtectedRoute] Access granted for role:", authState.user.role);
  return children;
};

export default ProtectedRoute;
