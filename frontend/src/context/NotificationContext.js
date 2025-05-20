import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import apiService from '../utils/api';
import { useAuth } from './AuthContext';

// Create the Notification Context
const NotificationContext = createContext(null);

/**
 * Notification provider component that manages notification state and operations
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();

  // Load notifications when user is authenticated
  useEffect(() => {
    const loadNotifications = async () => {
      if (!isAuthenticated || !user) {
        setNotifications([]);
        setUnread(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiService.getNotifications();
        setNotifications(response.notifications || []);
        setUnread(response.unread || 0);
      } catch (err) {
        console.error('Error loading notifications:', err);
        setError('Failed to load notifications');
        // Initialize with empty state
        setNotifications([]);
        setUnread(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [isAuthenticated, user]);

  /**
   * Add a new notification
   * @param {Object} notification - Notification object
   * @param {string} notification.id - Unique identifier
   * @param {string} notification.title - Notification title
   * @param {string} notification.message - Notification message
   * @param {string} [notification.type] - Notification type (info, success, warning, error)
   * @param {Date} [notification.timestamp] - When the notification was created
   */
  const addNotification = async (notification) => {
    try {
      // First try to persist to backend
      const result = await apiService.createNotification(notification);
      
      if (result && result.notification) {
        // Only add to state if backend creation was successful
        const newNotification = {
          ...result.notification,
          timestamp: new Date(result.notification.createdAt)
        };

        setNotifications((prev) => {
          // Check for duplicates before adding
          const isDuplicate = prev.some(n => 
            n.title === newNotification.title && 
            n.message === newNotification.message &&
            n.type === newNotification.type &&
            // Only consider it a duplicate if it's within the last 5 minutes
            (new Date() - new Date(n.timestamp)) < 5 * 60 * 1000
          );

          if (isDuplicate) {
            return prev;
          }

          return [newNotification, ...prev];
        });

        if (!newNotification.read) {
          setUnread((prev) => prev + 1);
        }

        // Show a toast for the notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
          status: newNotification.type || 'info',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (err) {
      console.error('Error persisting notification:', err);
      // Don't add to state if backend creation failed
    }
  };

  /**
   * Mark a notification as read
   * @param {string} id - Notification ID
   */
  const markAsRead = async (id) => {
    try {
      await apiService.markNotificationAsRead(id);
      
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnread(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read');
    }
  };

  /**
   * Clear all notifications
   */
  const clearAll = async () => {
    try {
      await apiService.clearAllNotifications();
      
      setNotifications([]);
      setUnread(0);
    } catch (err) {
      console.error('Error clearing notifications:', err);
      setError('Failed to clear notifications');
    }
  };

  // Context value
  const contextValue = {
    notifications,
    unread,
    isLoading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook for using the notification context
 * @returns {Object} Notification context value
 * @throws {Error} If used outside of NotificationProvider
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};