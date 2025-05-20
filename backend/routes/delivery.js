const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { isDistributor, isPharmacy } = require('../middleware/roles');
const memoryDb = require('../models/memoryDb');

const router = express.Router();

/**
 * @route   POST /api/delivery
 * @desc    Create a new delivery for an order
 * @access  Private/Distributor
 */
router.post('/', verifyToken, isDistributor, (req, res) => {
  try {
    const { orderId, deliveryType, scheduledDate, notes } = req.body;
    
    // Validate input
    if (!orderId || !deliveryType) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and delivery type are required'
      });
    }
    
    // Check if delivery type is valid
    if (!['pickup', 'scheduled', 'third-party'].includes(deliveryType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery type. Must be pickup, scheduled, or third-party'
      });
    }
    
    // Check if order exists
    const order = memoryDb.getOrderById(parseInt(orderId));
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to the distributor
    if (order.distributorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create delivery for this order'
      });
    }
    
    // Check if order is in a valid state for delivery
    if (order.status !== 'accepted' && order.status !== 'processing' && order.status !== 'shipped') {
      return res.status(400).json({
        success: false,
        message: 'Order must be accepted, processing, or shipped to create delivery'
      });
    }
    
    // Create delivery
    const delivery = memoryDb.createDelivery({
      orderId: parseInt(orderId),
      pharmacyId: order.pharmacyId,
      pharmacyName: order.pharmacyName,
      distributorId: req.user.id,
      distributorName: memoryDb.getUserById(req.user.id).businessName,
      deliveryType,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      notes,
      status: 'scheduled',
      timestamps: {
        created: new Date(),
        updated: new Date()
      }
    });
    
    // Update order status to shipped if not already
    if (order.status !== 'shipped') {
      memoryDb.updateOrderStatus(parseInt(orderId), 'shipped');
    }
    
    // Create notification for pharmacy
    memoryDb.createNotification({
      userId: order.pharmacyId,
      type: 'new_delivery',
      title: 'Delivery Scheduled',
      message: `Delivery for order #${order.id} has been scheduled as ${deliveryType}`,
      metadata: {
        deliveryId: delivery.id,
        orderId: order.id
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: delivery
    });
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating delivery',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery
 * @desc    Get all deliveries based on user role
 * @access  Private
 */
router.get('/', verifyToken, (req, res) => {
  try {
    let deliveries = [];
    
    // Filter deliveries based on role
    if (req.user.role === 'pharmacy') {
      deliveries = memoryDb.deliveries.filter(d => d.pharmacyId === req.user.id);
    } else if (req.user.role === 'distributor') {
      deliveries = memoryDb.deliveries.filter(d => d.distributorId === req.user.id);
    } else if (req.user.role === 'admin') {
      deliveries = memoryDb.deliveries;
    }
    
    // Apply filters if provided
    const { status } = req.query;
    if (status) {
      deliveries = deliveries.filter(delivery => delivery.status === status);
    }
    
    res.json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving deliveries',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery/:id
 * @desc    Get delivery by ID
 * @access  Private
 */
router.get('/:id', verifyToken, (req, res) => {
  try {
    const deliveryId = parseInt(req.params.id);
    const delivery = memoryDb.deliveries.find(d => d.id === deliveryId);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }
    
    // Check permissions
    if (req.user.role === 'pharmacy' && delivery.pharmacyId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this delivery'
      });
    }
    
    if (req.user.role === 'distributor' && delivery.distributorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this delivery'
      });
    }
    
    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving delivery',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/delivery/:id/confirm
 * @desc    Confirm delivery receipt
 * @access  Private/Pharmacy
 */
router.put('/:id/confirm', verifyToken, isPharmacy, (req, res) => {
  try {
    const upload = req.app.locals.upload;
    
    // Use multer upload middleware for confirmation image if provided
    upload.single('confirmationImage')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Error uploading file',
          error: err.message
        });
      }
      
      const deliveryId = parseInt(req.params.id);
      const { confirmationType, otpCode, notes } = req.body;
      
      // Validate input
      if (!confirmationType || !['signature', 'image', 'otp'].includes(confirmationType)) {
        return res.status(400).json({
          success: false,
          message: 'Valid confirmation type is required (signature, image, or otp)'
        });
      }
      
      // For OTP confirmation, check the code
      if (confirmationType === 'otp' && !otpCode) {
        return res.status(400).json({
          success: false,
          message: 'OTP code is required for OTP confirmation'
        });
      }
      
      // Get the delivery
      const delivery = memoryDb.deliveries.find(d => d.id === deliveryId);
      if (!delivery) {
        return res.status(404).json({
          success: false,
          message: 'Delivery not found'
        });
      }
      
      // Check if pharmacy owns this delivery
      if (delivery.pharmacyId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to confirm this delivery'
        });
      }
      
      // Update delivery status and add confirmation details
      const confirmationData = {
        type: confirmationType,
        timestamp: new Date(),
        notes: notes || '',
        imagePath: req.file ? req.file.path : null,
        otpCode: otpCode || null
      };
      
      const updatedDelivery = memoryDb.updateDeliveryStatus(
        deliveryId, 
        'delivered', 
        confirmationData
      );
      
      // Update the order status to delivered
      memoryDb.updateOrderStatus(delivery.orderId, 'delivered');
      
      // Create notification for distributor
      memoryDb.createNotification({
        userId: delivery.distributorId,
        type: 'delivery_confirmed',
        title: 'Delivery Confirmed',
        message: `Delivery for order #${delivery.orderId} has been confirmed by ${delivery.pharmacyName}`,
        metadata: {
          deliveryId: delivery.id,
          orderId: delivery.orderId
        }
      });
      
      res.json({
        success: true,
        message: 'Delivery confirmed successfully',
        data: updatedDelivery
      });
    });
  } catch (error) {
    console.error('Confirm delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming delivery',
      error: error.message
    });
  }
});

module.exports = router;
