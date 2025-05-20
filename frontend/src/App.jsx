import React, { useMemo } from 'react';
import { 
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Navigate,
  useLocation,
  createRoutesFromElements
} from 'react-router-dom';
import { ChakraProvider, Box, Spinner } from '@chakra-ui/react';
import theme from './utils/theme';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './context/AuthContext';
import './styles/global.css';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';

// Distributor Screens
import DistributorDashboard from './screens/distributor/DistributorDashboard';
import DistributorOrders from './screens/distributor/DistributorOrders';
import DistributorPayments from './screens/distributor/DistributorPayments';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Memoize the route configuration to prevent unnecessary re-renders
  const routes = useMemo(() => {
    // Show loading spinner while authentication status is being determined
    if (isLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
          />
        </Box>
      );
    }

    // Determine if we're on an auth route
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

    // If authenticated and on auth route, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    // If not authenticated and not on auth route, redirect to login
    if (!isAuthenticated && !isAuthRoute) {
      return <Navigate to="/login" replace />;
    }

    return (
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Distributor Routes */}
        <Route 
          path="/distributor/dashboard" 
          element={
            <ProtectedRoute requiredRole="distributor">
              <DistributorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/distributor/orders" 
          element={
            <ProtectedRoute requiredRole="distributor">
              <DistributorOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/distributor/payments" 
          element={
            <ProtectedRoute requiredRole="distributor">
              <DistributorPayments />
            </ProtectedRoute>
          } 
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }, [isLoading, isAuthenticated, user?.role, location.pathname]);

  return routes;
};

// Create router with future flags
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="*" element={<AppRoutes />} />
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

// Wrap the app with providers
const AppWithProviders = () => (
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </ChakraProvider>
);

export default AppWithProviders;