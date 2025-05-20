/**
 * Notification utility for handling push notifications
 * For the MVP, we'll simulate push notifications
 * In a real implementation, this would integrate with Firebase Cloud Messaging
 */

const memoryDb = require('../models/memoryDb');

class NotificationService {
  constructor() {
    this.fcmEnabled = false;
    console.log('Notification service initialized');
  }
  
  /**
   * Send a push notification to a user
   * @param {Object} notification - The notification object
   * @param {number} userId - The user ID to send the notification to
   */
  async sendPushNotification(notification, userId) {
    try {
      if (!notification || !userId) {
        throw new Error('Notification and userId are required');
      }
      
      // Check if user exists
      const user = memoryDb.getUserById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // In a real implementation, we would use FCM here
      // For MVP, we'll just log and store the notification
      console.log(`Push notification sent to user ${userId}: ${notification.title}`);
      
      // Store notification in the database
      memoryDb.createNotification({
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        metadata: notification.metadata || {}
      });
      
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }
  
  /**
   * Send order status update notification
   * @param {Object} order - The order object
   */
  async sendOrderStatusUpdate(order) {
    try {
      const notification = {
        title: 'Order Status Updated',
        message: `Your order #${order.id} status has been updated to: ${order.status}`,
        type: 'order_update',
        metadata: {
          orderId: order.id,
          status: order.status
        }
      };
      
      // Send to pharmacy
      return this.sendPushNotification(notification, order.pharmacyId);
    } catch (error) {
      console.error('Error sending order status notification:', error);
      return false;
    }
  }
  
  /**
   * Send payment status update notification
   * @param {Object} payment - The payment object
   */
  async sendPaymentStatusUpdate(payment) {
    try {
      const notification = {
        title: 'Payment Status Updated',
        message: `Your payment of ${payment.amount} JD has been updated to: ${payment.status}`,
        type: 'payment_update',
        metadata: {
          paymentId: payment.id,
          status: payment.status
        }
      };
      
      // Send to pharmacy
      return this.sendPushNotification(notification, payment.pharmacyId);
    } catch (error) {
      console.error('Error sending payment status notification:', error);
      return false;
    }
  }
  
  /**
   * Send new order notification to distributor
   * @param {Object} order - The order object
   */
  async sendNewOrderNotification(order) {
    try {
      const notification = {
        title: 'New Order Received',
        message: `You have received a new order #${order.id} from ${order.pharmacyName}`,
        type: 'new_order',
        metadata: {
          orderId: order.id
        }
      };
      
      // Send to distributor
      return this.sendPushNotification(notification, order.distributorId);
    } catch (error) {
      console.error('Error sending new order notification:', error);
      return false;
    }
  }
  
  /**
   * Send payment due reminder to pharmacy
   * @param {Object} payment - The payment object
   */
  async sendPaymentDueReminder(payment) {
    try {
      const notification = {
        title: 'Payment Due Reminder',
        message: `Your payment of ${payment.amount} JD is due soon`,
        type: 'payment_reminder',
        metadata: {
          paymentId: payment.id,
          dueDate: payment.dueDate
        }
      };
      
      // Send to pharmacy
      return this.sendPushNotification(notification, payment.pharmacyId);
    } catch (error) {
      console.error('Error sending payment reminder notification:', error);
      return false;
    }
  }
}

// Create and export notification service instance
const notificationService = new NotificationService();
module.exports = notificationService;
