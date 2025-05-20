const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { isPharmacy, isDistributor } = require('../middleware/roles');
const memoryDb = require('../models/memoryDb');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private/Pharmacy
 */
router.post('/', verifyToken, isPharmacy, (req, res) => {
  try {
    const { items, distributorId, notes } = req.body;
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }
    
    // Check distributor exists
    const distributor = memoryDb.getUserById(parseInt(distributorId));
    if (!distributor || distributor.role !== 'distributor') {
      return res.status(400).json({
        success: false,
        message: 'Invalid distributor'
      });
    }
    
    // Check credit limit
    if (memoryDb.isExceedingCreditLimit(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot place order due to exceeded credit limit'
      });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const processedItems = [];
    
    for (const item of items) {
      // Validate item format
      if (!item.productId || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have productId and quantity'
        });
      }
      
      // Get product details
      const product = memoryDb.getProductById(parseInt(item.productId));
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }
      
      const itemTotal = product.price * parseInt(item.quantity);
      totalAmount += itemTotal;
      
      processedItems.push({
        productId: parseInt(item.productId),
        name: product.name,
        price: product.price,
        quantity: parseInt(item.quantity),
        total: itemTotal
      });
    }
    
    // Create order
    const order = memoryDb.createOrder({
      pharmacyId: req.user.id,
      pharmacyName: memoryDb.getUserById(req.user.id).businessName,
      distributorId: parseInt(distributorId),
      distributorName: distributor.businessName,
      items: processedItems,
      totalAmount,
      notes,
      status: 'pending',
      timestamps: {
        created: new Date(),
        updated: new Date()
      }
    });
    
    // Create notification for distributor
    memoryDb.createNotification({
      userId: parseInt(distributorId),
      type: 'new_order',
      title: 'New Order Received',
      message: `New order #${order.id} received from ${order.pharmacyName}`,
      metadata: {
        orderId: order.id
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get all orders based on user role
 * @access  Private
 */
router.get('/', verifyToken, (req, res) => {
  try {
    let orders = [];
    
    // Filter orders based on role
    if (req.user.role === 'pharmacy') {
      orders = memoryDb.getOrdersByPharmacy(req.user.id);
    } else if (req.user.role === 'distributor') {
      orders = memoryDb.getOrdersByDistributor(req.user.id);
    } else if (req.user.role === 'admin') {
      orders = memoryDb.getOrders();
    }
    
    // Apply filters if provided
    const { status } = req.query;
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving orders',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', verifyToken, (req, res) => {
  try {
    const order = memoryDb.getOrderById(parseInt(req.params.id));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check permissions
    if (req.user.role === 'pharmacy' && order.pharmacyId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    if (req.user.role === 'distributor' && order.distributorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving order',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private/Distributor
 */
router.put('/:id/status', verifyToken, isDistributor, (req, res) => {
  try {
    const { status } = req.body;
    const orderId = parseInt(req.params.id);
    
    // Validate status
    if (!['pending', 'accepted', 'rejected', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    // Get the order
    const order = memoryDb.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if the distributor owns this order
    if (order.distributorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    // Update order status
    const updatedOrder = memoryDb.updateOrderStatus(orderId, status);
    
    // Create notification for pharmacy
    memoryDb.createNotification({
      userId: order.pharmacyId,
      type: 'order_status_update',
      title: 'Order Status Updated',
      message: `Your order #${order.id} has been updated to: ${status}`,
      metadata: {
        orderId: order.id,
        status
      }
    });
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

module.exports = router;
