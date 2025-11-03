import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useData } from "../../context/DataContext"

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useData();

  // While user state is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking access...
      </div>
    );
  }

  // If user exists and role matches, render the protected children
  if (user && user.role === role) {
    return children;
  }

  // Otherwise, redirect to main page
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
