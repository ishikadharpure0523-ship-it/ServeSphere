import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role } = useAuth();

  // Check if user is authenticated
  if (!user) {
    // Redirect to sign in page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  // Check if user has the required role (if specified)
  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's role
    const dashboardMap = {
      volunteer: '/dashboard/volunteer',
      donor: '/dashboard/donor',
      ngo: '/dashboard/ngo',
    };
    return <Navigate to={dashboardMap[role] || '/signin'} replace />;
  }

  // User is authenticated and has correct role
  return children;
}
