const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { isDistributor, isAdmin } = require('../middleware/roles');
const memoryDb = require('../models/memoryDb');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Private
 */
router.get('/', verifyToken, (req, res) => {
  try {
    const products = memoryDb.getProducts();
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Private
 */
router.get('/:id', verifyToken, (req, res) => {
  try {
    const product = memoryDb.getProductById(parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving product',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a product
 * @access  Private/Distributor/Admin
 */
router.post('/', verifyToken, isDistributor, (req, res) => {
  try {
    const { name, description, price, category, manufacturer, sku, stockQuantity } = req.body;
    
    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and price'
      });
    }
    
    const product = memoryDb.createProduct({
      name,
      description,
      price: parseFloat(price),
      category,
      manufacturer,
      sku,
      stockQuantity: parseInt(stockQuantity) || 0,
      distributorId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private/Distributor/Admin
 */
router.put('/:id', verifyToken, isDistributor, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = memoryDb.getProductById(productId);
    
    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if user owns the product or is admin
    if (product.distributorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }
    
    // Update product properties
    const updatedFields = {};
    const allowedFields = ['name', 'description', 'price', 'category', 'manufacturer', 'sku', 'stockQuantity'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updatedFields[field] = field === 'price' 
          ? parseFloat(req.body[field]) 
          : field === 'stockQuantity' 
            ? parseInt(req.body[field]) 
            : req.body[field];
      }
    });
    
    // Update in the database
    const index = memoryDb.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      memoryDb.products[index] = {
        ...memoryDb.products[index],
        ...updatedFields,
        updatedAt: new Date()
      };
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: memoryDb.products[index]
      });
    } else {
      throw new Error('Product not found in database');
    }
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

module.exports = router;
