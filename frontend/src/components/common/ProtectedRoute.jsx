import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const VITE_API_URL=import.meta.env.VITE_API_URL



const ProtectedRoute = ({ children, role }) => {
  const [authState, setAuthState] = useState({ loading: true, allowed: false });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/api/auth/check`, {
  withCredentials: true,
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
