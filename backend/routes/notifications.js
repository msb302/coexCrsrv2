const express = require('express');
const { verifyToken } = require('../middleware/auth');
const memoryDb = require('../models/memoryDb');

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the current user
 * @access  Private
 */
router.get('/', verifyToken, (req, res) => {
  try {
    const notifications = memoryDb.getNotificationsByUserId(req.user.id);
    const unread = notifications.filter(n => !n.read).length;
    
    res.json({
      success: true,
      notifications,
      unread
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving notifications',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put('/:id/read', verifyToken, (req, res) => {
  try {
    const notification = memoryDb.markNotificationAsRead(req.params.id, req.user.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', verifyToken, (req, res) => {
  try {
    memoryDb.markAllNotificationsAsRead(req.user.id);
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/notifications
 * @desc    Clear all notifications
 * @access  Private
 */
router.delete('/', verifyToken, (req, res) => {
  try {
    memoryDb.clearAllNotifications(req.user.id);
    
    res.json({
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing notifications',
      error: error.message
    });
  }
});

module.exports = router; 