const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { isPharmacy, isDistributor } = require('../middleware/roles');
const memoryDb = require('../models/memoryDb');

const router = express.Router();

/**
 * @route   POST /api/payments
 * @desc    Upload a new payment (check image)
 * @access  Private/Pharmacy
 */
router.post('/', verifyToken, isPharmacy, (req, res) => {
  try {
    const upload = req.app.locals.upload;
    
    // Use multer upload middleware for the check image
    upload.single('checkImage')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Error uploading file',
          error: err.message
        });
      }
      
      const { amount, distributorId, dueDate, notes, orderId } = req.body;
      
      // Validate input
      if (!amount || !distributorId) {
        return res.status(400).json({
          success: false,
          message: 'Amount and distributor ID are required'
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
      
      // Create payment
      const payment = memoryDb.createPayment({
        pharmacyId: req.user.id,
        pharmacyName: memoryDb.getUserById(req.user.id).businessName,
        distributorId: parseInt(distributorId),
        distributorName: distributor.businessName,
        amount: parseFloat(amount),
        checkImagePath: req.file ? req.file.path : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        orderId: orderId ? parseInt(orderId) : null,
        status: 'pending',
        timestamps: {
          created: new Date(),
          updated: new Date()
        }
      });
      
      // Create notification for distributor
      memoryDb.createNotification({
        userId: parseInt(distributorId),
        type: 'new_payment',
        title: 'New Payment Received',
        message: `New payment of ${amount} JD received from ${payment.pharmacyName}`,
        metadata: {
          paymentId: payment.id
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/payments
 * @desc    Get all payments based on user role
 * @access  Private
 */
router.get('/', verifyToken, (req, res) => {
  try {
    let payments = [];
    
    // Filter payments based on role
    if (req.user.role === 'pharmacy') {
      payments = memoryDb.getPaymentsByPharmacy(req.user.id);
    } else if (req.user.role === 'distributor') {
      // Get payments where the distributor is the recipient
      payments = memoryDb.payments.filter(p => p.distributorId === req.user.id);
    } else if (req.user.role === 'admin') {
      payments = memoryDb.getPayments();
    }
    
    // Apply filters if provided
    const { status } = req.query;
    if (status) {
      payments = payments.filter(payment => payment.status === status);
    }
    
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving payments',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/:id', verifyToken, (req, res) => {
  try {
    const payment = memoryDb.getPaymentById(parseInt(req.params.id));
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Check permissions
    if (req.user.role === 'pharmacy' && payment.pharmacyId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }
    
    if (req.user.role === 'distributor' && payment.distributorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving payment',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/payments/:id/status
 * @desc    Update payment status
 * @access  Private/Distributor
 */
router.put('/:id/status', verifyToken, isDistributor, (req, res) => {
  try {
    const { status } = req.body;
    const paymentId = parseInt(req.params.id);
    
    // Validate status
    if (!['pending', 'processed', 'cleared', 'rejected', 'bounced'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    // Get the payment
    const payment = memoryDb.getPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Check if the distributor owns this payment
    if (payment.distributorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this payment'
      });
    }
    
    // Update payment status
    const updatedPayment = memoryDb.updatePaymentStatus(paymentId, status);
    
    // Create notification for pharmacy
    memoryDb.createNotification({
      userId: payment.pharmacyId,
      type: 'payment_status_update',
      title: 'Payment Status Updated',
      message: `Your payment of ${payment.amount} JD has been updated to: ${status}`,
      metadata: {
        paymentId: payment.id,
        status
      }
    });
    
    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedPayment
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
});

module.exports = router;
