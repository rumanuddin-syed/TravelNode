import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role } = useContext(AuthContext);

  // 1. Check if user is logged in
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user's role is allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Show warning and redirect to home if not authorized
    toast.warning("You are not authorized to access this page.");
    return <Navigate to="/home" replace />;
  }

  // 3. User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
