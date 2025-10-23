import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const [authState, setAuthState] = useState({ loading: true, allowed: false });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5500/api/auth/check", {
          withCredentials: true, // send the cookie
        });

        if (res.data.user && res.data.user.role === role) {
          setAuthState({ loading: false, allowed: true });
        } else {
          setAuthState({ loading: false, allowed: false });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthState({ loading: false, allowed: false });
      }
    };

    checkAuth();
  }, [role]);

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    );
  }

  return authState.allowed ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
