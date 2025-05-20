import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../utils/api';

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * Auth provider component that manages authentication state and operations
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          // Set initial state from localStorage
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          
          // Set auth token for API requests
          apiService.setAuthToken(storedToken);
          
          // Verify token by getting current user data
          try {
            const userData = await apiService.getCurrentUser();
            // Only update if the data is different
            if (JSON.stringify(userData) !== storedUser) {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } catch (error) {
            // If verification fails, clear credentials
            handleLogout();
          }
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []); // Empty dependency array since this should only run once on mount

  /**
   * Handle successful authentication
   * @param {Object} response - Authentication response
   * @param {Object} response.user - User data
   * @param {string} response.token - Authentication token
   */
  const handleAuthSuccess = (response) => {
    const { user, token } = response;
    
    // Store credentials
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update state
    setUser(user);
    setToken(token);
    setError(null);
    
    // Set auth token for API requests
    apiService.setAuthToken(token);
  };

  /**
   * Handle authentication errors
   * @param {Error} err - Error object
   * @returns {Object} Error response
   */
  const handleAuthError = (err) => {
    const errorMessage = err.response?.data?.message || err.message || 'Authentication failed';
    setError(errorMessage);
    
    // If it's a session expiration error, clear credentials
    if (errorMessage.includes('Session expired')) {
      handleLogout();
    }
    
    return { success: false, message: errorMessage };
  };

  /**
   * Login user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login result
   */
  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login({ username, password });
      handleAuthSuccess(response);
      return { success: true };
    } catch (err) {
      return handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting registration with data:', { ...userData, password: '[REDACTED]' });
      const response = await apiService.register(userData);
      console.log('Registration response:', response);
      handleAuthSuccess(response);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      return handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const handleLogout = () => {
    // Clear credentials
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear state
    setUser(null);
    setToken(null);
    setError(null);
    
    // Clear API auth token
    apiService.clearAuthToken();
  };

  // Context value
  const contextValue = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for using the auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};