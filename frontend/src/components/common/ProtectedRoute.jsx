import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const [authState, setAuthState] = useState({ loading: true, allowed: false });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/check-auth", {
          withCredentials: true,
        });

        if (res.data.role === role) {
          setAuthState({ loading: false, allowed: true });
        } else {
          setAuthState({ loading: false, allowed: false });
        }
      } catch (err) {
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

  return authState.allowed ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
