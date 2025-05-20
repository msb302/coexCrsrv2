import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component - Redirects to login if not authenticated
 * or if the user's role is not allowed
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Store the location the user was trying to access
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      localStorage.setItem('redirectPath', location.pathname);
    }
  }, [isLoading, isAuthenticated, location]);

  // Show loading spinner while authentication status is being determined
  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // If allowedRoles is specified, check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'pharmacy') {
      return <Navigate to="/pharmacy" />;
    } else if (user.role === 'distributor') {
      return <Navigate to="/distributor" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/auth/login" />;
    }
  }

  // If authenticated and role is allowed, render the children
  return children;
};

export default ProtectedRoute;