// src/components/ProtectedRoute.jsx
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isSignedIn } = useUser();
  return !isSignedIn ? <Navigate to="/" replace /> : <Outlet />;
};

export default ProtectedRoute;
