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
      try {
        const res = await axios.get(`${API_URL}/auth/check`, {
          withCredentials: true, // send the cookie
        });

        setAuthState({
          loading: false,
          user: res.data.user || null,
        });
      } catch (err) {
        setAuthState({ loading: false, user: null });
      }
    };

    fetchAuth();
  }, []);

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    );
  }

  // If user exists and role matches, render children
  if (authState.user && authState.user.role === role) {
    return children;
  }

  // Otherwise redirect
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
